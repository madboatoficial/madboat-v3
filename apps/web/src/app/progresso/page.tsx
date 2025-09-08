"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthState } from '@/hooks/use-auth-state'
import { AppLayout } from '@/layouts/AppLayout'
import { 
  getUserHexagonProgress, 
  getHexagonDefinitions, 
  activateHexagon,
  getAlmaLetterAssignments,
  getConnectionLines,
  initializeUserHexagonProgress,
  checkPersonaCompletion,
  type HexagonProgress,
  type HexagonDefinition,
  type AlmaLetterAssignment
} from '@/actions/hexagon-actions'

// Types for hexagon states
type HexagonState = 'locked' | 'available' | 'completed' | 'active'

interface UserProgress {
  personaCompleted: boolean
  almaModules: number // 0-19
  vortexModules: number // 0-7  
  odisseiaModules: number // 0-7
}

export default function ProgressoPage() {
  const { user, signOut } = useAuthState()
  const router = useRouter()
  const [activeHex, setActiveHex] = useState(0)
  const [isExploding, setIsExploding] = useState(false)
  const [zoomMode, setZoomMode] = useState<'global' | number | 'hex'>('global') // 'global', índice do grupo, ou 'hex'
  const [viewBox, setViewBox] = useState("0 0 4000 1200")
  const [focusedHex, setFocusedHex] = useState<{x: number, y: number, id: number} | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    personaCompleted: false,
    almaModules: 0,
    vortexModules: 0,
    odisseiaModules: 0
  })
  const [groupsRevealed, setGroupsRevealed] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const [selectedHexInfo, setSelectedHexInfo] = useState<any>(null)
  const [connectionLines, setConnectionLines] = useState<Array<{from: {x: number, y: number}, to: {x: number, y: number}}>>([])
  const [almaLetters, setAlmaLetters] = useState<Array<{id: number, letter: string, label: string}>>([])
  const [hexagonProgress, setHexagonProgress] = useState<HexagonProgress[]>([])
  const [hexagonDefinitions, setHexagonDefinitions] = useState<HexagonDefinition[]>([])
  const [loading, setLoading] = useState(true)
  
  // Load user progress and hexagon data from database
  useEffect(() => {
    if (!user?.id) return

    const loadHexagonData = async () => {
      try {
        setLoading(true)
        
        // Initialize user progress if not exists
        await initializeUserHexagonProgress(user.id)
        
        // Load all hexagon data
        const [progress, definitions, almaAssignments, connections] = await Promise.all([
          getUserHexagonProgress(user.id),
          getHexagonDefinitions(),
          getAlmaLetterAssignments(user.id),
          getConnectionLines(user.id)
        ])
        
        setHexagonProgress(progress)
        setHexagonDefinitions(definitions)
        
        // Set ALMA letters if they exist
        if (almaAssignments.length > 0) {
          const letters = almaAssignments.map(assignment => ({
            id: assignment.hexagon_id,
            letter: assignment.letter,
            label: assignment.label
          }))
          setAlmaLetters(letters)
        }
        
        // Set connection lines if they exist
        if (connections.length > 0) {
          const lines = connections.map(conn => ({
            from: { x: conn.from_hexagon_id === 0 ? 300 : 1600, y: 400 },
            to: { x: conn.to_hexagon_id === 1 ? 1600 : 300, y: 400 }
          }))
          setConnectionLines(lines)
        }
        
        // Check persona completion and set user progress
        const personaCompleted = await checkPersonaCompletion(user.id)
        
        // Calculate module progress based on hexagon status
        const almaModules = progress.filter(p => 
          p.hexagon_id >= 1 && p.hexagon_id <= 19 && p.status === 'completed'
        ).length
        
        const vortexModules = progress.filter(p => 
          p.hexagon_id >= 20 && p.hexagon_id <= 26 && p.status === 'completed'
        ).length
        
        const odisseiaModules = progress.filter(p => 
          p.hexagon_id >= 27 && p.hexagon_id <= 33 && p.status === 'completed'
        ).length
        
        const userProgressData = {
          personaCompleted,
          almaModules,
          vortexModules,
          odisseiaModules
        }
        
        setUserProgress(userProgressData)
        setGroupsRevealed(personaCompleted || almaAssignments.length > 0)
        
      } catch (error) {
        console.error('Failed to load hexagon data:', error)
        // Fallback to localStorage data if available
        const savedPersona = localStorage.getItem('madboat_persona')
        setUserProgress({
          personaCompleted: !!savedPersona,
          almaModules: 0,
          vortexModules: 0,
          odisseiaModules: 0
        })
      } finally {
        setLoading(false)
      }
    }

    loadHexagonData()
  }, [user?.id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          zoomToGlobal()
          break
        case ' ': // Spacebar
          e.preventDefault()
          if (zoomMode === 'global') {
            // Zoom to first available group
            for (let i = 0; i < hexagonGroups.length; i++) {
              const hasAvailableHex = hexagonGroups[i].hexagons.some(hex => 
                getHexagonState(i, hex.id) !== 'locked'
              )
              if (hasAvailableHex) {
                zoomToGroup(i)
                break
              }
            }
          }
          break
        case 'ArrowLeft':
          // Navigate to previous hexagon
          if (activeHex > 0) {
            const newHex = Math.max(0, activeHex - 1)
            setActiveHex(newHex)
            if (zoomMode !== 'global') zoomToHex(newHex)
          }
          break
        case 'ArrowRight':
          // Navigate to next hexagon
          if (activeHex < 33) {
            const newHex = Math.min(33, activeHex + 1)
            setActiveHex(newHex)
            if (zoomMode !== 'global') zoomToHex(newHex)
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [activeHex, zoomMode])

  // Handle persona activation
  const activatePersonaHex = async () => {
    if (!userProgress.personaCompleted || !user?.id) return

    try {
      // Call the database function to activate hexagon
      const result = await activateHexagon(user.id, 0)
      
      if (result.success) {
        // 1. FIRST: Reveal groups immediately
        setGroupsRevealed(true)
        
        // 2. Create connection line after groups appear
        setTimeout(() => {
          const personaCoords = { x: 300, y: 400 } // Persona position
          const almaCoords = { x: 1600, y: 400 }   // ALMA center position
          setConnectionLines([{ from: personaCoords, to: almaCoords }])
        }, 800)
        
        // 3. Set ALMA colors and letters
        setTimeout(() => {
          // Get ALMA letters from database or use default
          const almaLetterData = [
            { id: 2, letter: 'A', label: 'DNA' },
            { id: 3, letter: 'L', label: 'Negócio' },
            { id: 4, letter: 'M', label: 'Mapa' },
            { id: 5, letter: 'A', label: 'Voz' }
          ]
          setAlmaLetters(almaLetterData)
        }, 1200)

        // 4. Show achievement notification
        setTimeout(() => {
          setShowAchievement(true)
          setTimeout(() => setShowAchievement(false), 4000)
        }, 1800)

        // 5. Show info in footer
        setTimeout(() => {
          setSelectedHexInfo({
            id: 0,
            title: 'Persona Única Ativada!',
            description: 'Você desbloqueou sua identidade única e liberou acesso aos próximos módulos da jornada.',
            rewards: ['Acesso ao Método ALMA', 'DNA Criativo desbloqueado', 'Protocolo personalizado ativo'],
            nextSteps: 'Agora você pode explorar os hexágonos ALMA para desenvolver seu método único.'
          })
        }, 2200)

        // Reload hexagon data to get updated progress
        const updatedProgress = await getUserHexagonProgress(user.id)
        setHexagonProgress(updatedProgress)
      }
    } catch (error) {
      console.error('Failed to activate persona hexagon:', error)
    }
  }

  // Determine hexagon state based on database progress
  const getHexagonState = (groupIndex: number, hexId: number): HexagonState => {
    // Find the hexagon progress from database
    const progress = hexagonProgress.find(p => p.hexagon_id === hexId)
    
    if (!progress) {
      return 'locked' // Default state if no progress found
    }
    
    return progress.status as HexagonState
  }
  
  // Função para fazer zoom em um grupo específico
  const zoomToGroup = (groupIndex: number) => {
    const group = hexagonGroups[groupIndex]
    if (!group) return
    
    // Calcular limites do grupo
    const padding = 100
    const groupWidth = 300 // Largura estimada do grupo
    const groupHeight = 400 // Altura estimada do grupo
    
    const newViewBox = `${group.centerX - groupWidth/2 - padding} ${group.centerY - groupHeight/2 - padding} ${groupWidth + padding*2} ${groupHeight + padding*2}`
    setViewBox(newViewBox)
    setZoomMode(groupIndex)
    setFocusedHex(null)
  }

  // Função para fazer zoom em um hexágono específico
  const zoomToHex = (hexId: number) => {
    // Find hex coordinates
    let hexCoords = null
    for (const group of hexagonGroups) {
      const hex = group.hexagons.find(h => h.id === hexId)
      if (hex) {
        hexCoords = {
          x: group.centerX + hex.x,
          y: group.centerY + hex.y,
          id: hexId
        }
        break
      }
    }

    if (hexCoords) {
      const padding = 150
      const zoomWidth = 400
      const zoomHeight = 400
      
      const newViewBox = `${hexCoords.x - zoomWidth/2} ${hexCoords.y - zoomHeight/2} ${zoomWidth} ${zoomHeight}`
      setViewBox(newViewBox)
      setZoomMode('hex')
      setFocusedHex(hexCoords)
    }
  }
  
  // Função para voltar à visualização global
  const zoomToGlobal = () => {
    setViewBox("0 0 4000 1200")
    setZoomMode('global')
    setFocusedHex(null)
  }
  
  // Sistema de grupos de hexágonos
  const hexagonGroups = [
    // Grupo 1: Persona Única (1 hexágono)
    {
      title: "Persona Única",
      centerX: 300,
      centerY: 400,
      hexagons: [
        { x: 0, y: 0, id: 0 }
      ]
    },
    
    // Grupo 2: ALMA (centro + 2 camadas = 19 hexágonos)
    {
      title: "ALMA", 
      centerX: 1600,
      centerY: 400,
      hexagons: [
        // Centro
        { x: 0, y: 0, id: 1 },
        
        // Primeira camada (6 hexágonos) - maior espaçamento
        { x: 250, y: 0, id: 2 },
        { x: 125, y: 220, id: 3 },
        { x: -125, y: 220, id: 4 },
        { x: -250, y: 0, id: 5 },
        { x: -125, y: -220, id: 6 },
        { x: 125, y: -220, id: 7 },
        
        // Segunda camada (12 hexágonos) - maior espaçamento
        { x: 500, y: 0, id: 8 },
        { x: 375, y: 220, id: 9 },
        { x: 250, y: 440, id: 10 },
        { x: 0, y: 440, id: 11 },
        { x: -250, y: 440, id: 12 },
        { x: -375, y: 220, id: 13 },
        { x: -500, y: 0, id: 14 },
        { x: -375, y: -220, id: 15 },
        { x: -250, y: -440, id: 16 },
        { x: 0, y: -440, id: 17 },
        { x: 250, y: -440, id: 18 },
        { x: 375, y: -220, id: 19 }
      ]
    },
    
    // Grupo 3: Vortex (centro + 1 camada = 7 hexágonos)
    {
      title: "Vortex",
      centerX: 2600,
      centerY: 400,
      hexagons: [
        // Centro
        { x: 0, y: 0, id: 20 },
        
        // Primeira camada (6 hexágonos) - maior espaçamento
        { x: 250, y: 0, id: 21 },
        { x: 125, y: 220, id: 22 },
        { x: -125, y: 220, id: 23 },
        { x: -250, y: 0, id: 24 },
        { x: -125, y: -220, id: 25 },
        { x: 125, y: -220, id: 26 }
      ]
    },
    
    // Grupo 4: Odisseia (centro + 1 camada = 7 hexágonos)
    {
      title: "Odisseia",
      centerX: 3400,
      centerY: 400,
      hexagons: [
        // Centro
        { x: 0, y: 0, id: 27 },
        
        // Primeira camada (6 hexágonos) - maior espaçamento
        { x: 250, y: 0, id: 28 },
        { x: 125, y: 220, id: 29 },
        { x: -125, y: 220, id: 30 },
        { x: -250, y: 0, id: 31 },
        { x: -125, y: -220, id: 32 },
        { x: 125, y: -220, id: 33 }
      ]
    }
  ]
  
  const getHexInfo = (id: number) => {
    // Find which group this hex belongs to
    let groupName = 'UNKNOWN'
    let hexState: HexagonState = 'locked'
    let requirements = ''
    
    for (let i = 0; i < hexagonGroups.length; i++) {
      const group = hexagonGroups[i]
      if (group.hexagons.some(h => h.id === id)) {
        groupName = group.title
        hexState = getHexagonState(i, id)
        
        // Get requirements based on state and group
        switch (i) {
          case 0: // Persona Única
            requirements = userProgress.personaCompleted ? 'COMPLETO' : 'Complete o teste de persona'
            break
          case 1: // ALMA
            requirements = !userProgress.personaCompleted ? 'Requer: Persona Única' :
                          hexState === 'locked' ? `Requer: ALMA ${id - 1}` :
                          hexState === 'available' ? 'DISPONÍVEL' : 'COMPLETO'
            break
          case 2: // Vortex
            requirements = userProgress.almaModules < 19 ? 'Requer: ALMA completo' :
                          hexState === 'locked' ? `Requer: Vortex ${id - 20}` :
                          hexState === 'available' ? 'DISPONÍVEL' : 'COMPLETO'
            break
          case 3: // Odisseia
            requirements = userProgress.vortexModules < 7 ? 'Requer: Vortex completo' :
                          hexState === 'locked' ? `Requer: Odisseia ${id - 27}` :
                          hexState === 'available' ? 'DISPONÍVEL' : 'COMPLETO'
            break
        }
        break
      }
    }
    
    return { 
      position: groupName, 
      name: `${groupName} ${id}`, 
      state: hexState,
      requirements 
    }
  }
  
  // Show loading state if data is still loading
  if (loading || !user) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white/60 text-sm">Carregando sistema hexagonal...</p>
        </div>
      </div>
    )
  }

  // Extract clean name from email
  const userName = user?.email?.split('@')[0]?.split('.').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Navigator'

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'dashboard':
        router.push('/')
        break
      case 'progresso':
        router.push('/progresso')
        break
      case 'timeline':
        router.push('/timeline')
        break
      case 'desafios':
        console.log('🎯 Desafios - Em desenvolvimento')
        break
      case 'missoes':
        console.log('🗡️ Missões - Em desenvolvimento')
        break
      case 'conquistas':
        console.log('🏆 Conquistas - Em desenvolvimento')
        break
      case 'produtos':
        console.log('📦 Produtos - Em desenvolvimento')
        break
      case 'persona':
        router.push('/persona')
        break
      default:
        console.log('📄 Page navigation:', page)
    }
  }

  return (
    <AppLayout
      pageType="progresso"
      user={user}
      userName={userName}
      onLogout={signOut}
      onNavigate={handleNavigate}
    >
      <div className="w-full min-h-full flex items-center justify-center">
      <div className="text-center">
        <motion.h1 
          className="text-2xl font-light text-white/90 tracking-wide mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          LEGACY MAPS
        </motion.h1>
        
        <motion.p
          className="text-white/50 text-sm mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Hexagonal Grid System • AAA Architecture
        </motion.p>
        
        {/* SVG com sistema de grupos de hexágonos */}
        <motion.svg 
          width="4000" 
          height="1200" 
          viewBox={viewBox}
          className="w-full max-h-screen"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            viewBox: viewBox,
            transition: { 
              scale: { duration: 0.8, delay: 0.2 },
              opacity: { duration: 0.8, delay: 0.2 },
              viewBox: { 
                duration: 1.5, 
                ease: [0.4, 0, 0.2, 1], // Custom easing for smooth zoom
                type: "tween"
              }
            }
          }}
        >
          {/* Partículas de fundo flutuantes */}
          {[...Array(30)].map((_, i) => (
            <motion.circle
              key={`particle-${i}`}
              cx={Math.random() * 4000}
              cy={Math.random() * 1200}
              r={Math.random() * 3 + 1}
              fill="white"
              opacity="0.1"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Connection lines */}
          {connectionLines.map((line, index) => (
            <motion.line
              key={`connection-${index}`}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="#71717a"
              strokeWidth="1"
              opacity="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          ))}

          {/* Renderizar grupos de hexágonos */}
          {hexagonGroups.map((group, groupIndex) => {
            // Hide groups 2, 3, 4 until persona is activated
            if (groupIndex > 0 && !groupsRevealed) return null
            
            return (
            <motion.g
              key={`group-${groupIndex}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: zoomMode === groupIndex ? 1.1 : 1,
                transition: groupIndex === 0 ? {
                  // Persona group - always visible
                  duration: 0.8,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 80,
                  damping: 20
                } : {
                  // Other groups - animate in when revealed
                  duration: 1.2,
                  delay: groupsRevealed ? 0.5 + (groupIndex * 0.3) : 0,
                  type: "spring",
                  stiffness: 60,
                  damping: 15
                }
              }}
              className="cursor-pointer"
              onClick={() => zoomMode === groupIndex ? zoomToGlobal() : zoomToGroup(groupIndex)}
              whileHover={{ scale: zoomMode === 'global' ? 1.02 : 1 }}
            >
              {/* Área de fundo clicável para o grupo */}
              <motion.circle
                cx={group.centerX}
                cy={group.centerY}
                r={150}
                fill="transparent"
                stroke="none"
                className="cursor-pointer"
                whileHover={zoomMode === 'global' ? { 
                  fill: "rgba(255,255,255,0.02)",
                  stroke: "rgba(255,255,255,0.1)",
                  strokeWidth: 1
                } : {}}
              />
              {/* Título do grupo - clicável para zoom */}
              <motion.text
                x={group.centerX}
                y={group.centerY + 180}
                fontSize="16"
                textAnchor="middle"
                fill="white"
                opacity={zoomMode === groupIndex ? "1" : "0.8"}
                className="cursor-pointer select-none font-mono font-light hover:opacity-100"
                initial={{ opacity: 0, y: group.centerY + 200 }}
                animate={{ opacity: zoomMode === groupIndex ? 1 : 0.8, y: group.centerY + 180 }}
                transition={{ 
                  duration: 0.6,
                  delay: 0.5 + (groupIndex * 0.2)
                }}
                onClick={() => zoomMode === groupIndex ? zoomToGlobal() : zoomToGroup(groupIndex)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {group.title}
              </motion.text>
              
              {/* Hexágonos do grupo */}
              {group.hexagons.map((hex, hexIndex) => {
                const x = group.centerX + hex.x
                const y = group.centerY + hex.y
                const size = 100 // Hexágonos dobrados de tamanho (era 50)
                const isActive = activeHex === hex.id
                const hexState = getHexagonState(groupIndex, hex.id)
                
                // Get color and style based on state and specific hexagon
                const getHexagonStyle = (state: HexagonState, hexId: number, groupIdx: number) => {
                  // Special case for Persona hexagon (id 0)
                  if (hexId === 0) {
                    if (state === 'active') {
                      return {
                        stroke: '#FFD700', // Golden
                        fill: 'rgba(255, 215, 0, 0.15)',
                        opacity: '1',
                        strokeWidth: '3',
                        cursor: 'pointer'
                      }
                    } else if (userProgress.personaCompleted) {
                      return {
                        stroke: '#3B82F6', // Blue like "Iniciar minha descoberta" button
                        fill: 'rgba(59, 130, 246, 0.1)',
                        opacity: '1',
                        strokeWidth: '2',
                        cursor: 'pointer'
                      }
                    }
                  }

                  // ALMA group coloring
                  if (groupIdx === 1 && userProgress.personaCompleted) {
                    if (hexId === 1) { // ALMA center
                      return {
                        stroke: '#14B8A6', // Turquoise
                        fill: 'rgba(20, 184, 166, 0.1)',
                        opacity: '1',
                        strokeWidth: '2',
                        cursor: 'pointer'
                      }
                    } else {
                      // Other ALMA hexagons - darker turquoise
                      return {
                        stroke: '#0F766E', // Darker turquoise
                        fill: 'none',
                        opacity: '0.8',
                        strokeWidth: '1',
                        cursor: 'pointer'
                      }
                    }
                  }
                  
                  // Default neutral colors
                  switch (state) {
                    case 'locked':
                    case 'available':
                    default:
                      return {
                        stroke: '#71717a', // zinc-500 neutral
                        fill: 'none',
                        opacity: state === 'locked' ? '0.3' : '0.6',
                        strokeWidth: '1',
                        cursor: state === 'locked' ? 'not-allowed' : 'pointer'
                      }
                    case 'completed':
                      return {
                        stroke: '#ffffff',
                        fill: 'rgba(255, 255, 255, 0.1)',
                        opacity: '1',
                        strokeWidth: '2',
                        cursor: 'pointer'
                      }
                    case 'active':
                      return {
                        stroke: '#FFD700', // Golden for all active
                        fill: 'rgba(255, 215, 0, 0.15)',
                        opacity: '1',
                        strokeWidth: '3',
                        cursor: 'pointer'
                      }
                  }
                }
                
                const hexStyle = getHexagonStyle(hexState, hex.id, groupIndex)
                
                // Calcular pontos do hexágono
                const hexPoints = [...Array(6)].map((_, j) => {
                  const hexAngle = (Math.PI / 3) * j
                  const px = Math.cos(hexAngle) * size
                  const py = Math.sin(hexAngle) * size
                  return `${px},${py}`
                }).join(' ')
                
                return (
                  <motion.g
                    key={`hex-${hex.id}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: x,
                      y: y
                    }}
                    transition={{ 
                      duration: 0.5,
                      delay: 0.6 + (groupIndex * 0.2) + (hexIndex * 0.05),
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                  >
                    {/* Glow para hexágono ativo/pulsação dourada */}
                    <AnimatePresence>
                      {(isActive || hexState === 'active') && (
                        <motion.polygon
                          points={hexPoints}
                          fill="none"
                          stroke={hexState === 'active' ? "#FFD700" : "white"}
                          strokeWidth="2"
                          opacity="0.5"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ 
                            scale: [1, 1.4, 1],
                            opacity: [0.5, 0.2, 0.5]
                          }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{
                            duration: hexState === 'active' ? 2.0 : 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Hexágono principal */}
                    <motion.polygon
                      points={hexPoints}
                      fill={hexStyle.fill}
                      stroke={hexStyle.stroke}
                      strokeWidth={isActive ? String(Number(hexStyle.strokeWidth) + 1) : hexStyle.strokeWidth}
                      opacity={hexStyle.opacity}
                      style={{ cursor: hexStyle.cursor }}
                      whileHover={hexState !== 'locked' ? { 
                        scale: 1.2,
                        strokeWidth: Number(hexStyle.strokeWidth) + 1,
                        opacity: 1,
                        filter: `drop-shadow(0 0 10px ${hexStyle.stroke})`
                      } : {}}
                      whileTap={hexState !== 'locked' ? { 
                        scale: 0.9
                      } : {}}
                      animate={isActive ? { 
                        strokeWidth: [Number(hexStyle.strokeWidth), Number(hexStyle.strokeWidth) + 1, Number(hexStyle.strokeWidth)]
                      } : {}}
                      transition={{ 
                        strokeWidth: { duration: 0.8, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
                        scale: { duration: 0.3, ease: "easeOut" },
                        fill: { duration: 0.2 },
                        filter: { duration: 0.3 }
                      }}
                    />
                    
                    {/* Área clicável invisível */}
                    <motion.polygon
                      points={hexPoints}
                      fill="transparent"
                      stroke="none"
                      className={hexState !== 'locked' ? "cursor-pointer" : "cursor-not-allowed"}
                      onClick={() => {
                        if (hexState !== 'locked') {
                          setActiveHex(hex.id)
                          
                          // Show hexagon info in footer
                          const hexInfo = getHexInfo(hex.id)
                          setSelectedHexInfo({
                            id: hex.id,
                            title: hexInfo.name,
                            description: hexInfo.requirements,
                            rewards: hex.id === 0 ? ['Acesso ao Método ALMA', 'DNA Criativo desbloqueado', 'Protocolo personalizado ativo'] : [],
                            nextSteps: hex.id === 0 ? 'Clique para ativar sua persona e desbloquear os próximos módulos' : undefined
                          })
                          
                          // Special handling for Persona hexagon (id 0)
                          if (hex.id === 0 && userProgress.personaCompleted) {
                            activatePersonaHex()
                          }
                          
                          // Double-click or specific condition to zoom to hex
                          if (zoomMode === 'global' || zoomMode === groupIndex) {
                            zoomToHex(hex.id)
                          }
                        }
                      }}
                      whileHover={hexState !== 'locked' ? { 
                        scale: 1.1,
                        transition: { duration: 0.2 }
                      } : {}}
                    />
                    
                    {/* Conteúdo do hexágono */}
                    <motion.text
                      x={0}
                      y={8}
                      fontSize="24"
                      textAnchor="middle"
                      fill={hexState === 'locked' ? '#71717a' : 
                            hexState === 'completed' ? '#10b981' :
                            hexState === 'available' ? '#22d3ee' : '#ffffff'}
                      opacity={hexState === 'locked' ? "0.4" : isActive ? "1" : "0.8"}
                      className="pointer-events-none select-none font-mono font-bold"
                      whileHover={hexState !== 'locked' ? {
                        scale: 1.2,
                        opacity: 1
                      } : {}}
                      animate={isActive && hexState !== 'locked' ? {
                        scale: [1, 1.1, 1],
                        color: [hexStyle.stroke, "#ffffff", hexStyle.stroke]
                      } : {}}
                      transition={{
                        scale: { duration: 0.4 },
                        color: { duration: 2, repeat: isActive ? Infinity : 0 }
                      }}
                    >
                      {hexState === 'completed' ? '✓' : 
                       almaLetters.find(letter => letter.id === hex.id)?.letter || hex.id}
                    </motion.text>

                    {/* ALMA Labels */}
                    {almaLetters.find(letter => letter.id === hex.id) && (
                      <motion.text
                        x={0}
                        y={35}
                        fontSize="14"
                        textAnchor="middle"
                        fill="#14B8A6"
                        opacity="0.9"
                        className="pointer-events-none select-none font-light"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 0.9, y: 25 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {almaLetters.find(letter => letter.id === hex.id)?.label}
                      </motion.text>
                    )}

                    {/* Lock icon for locked hexagons */}
                    {hexState === 'locked' && !almaLetters.find(letter => letter.id === hex.id) && (
                      <motion.text
                        x={0}
                        y={-15}
                        fontSize="16"
                        textAnchor="middle"
                        fill="#71717a"
                        opacity="0.6"
                        className="pointer-events-none select-none"
                      >
                        🔒
                      </motion.text>
                    )}
                  </motion.g>
                )
              })}
            </motion.g>
            )
          })}
          
          {/* Conexões entre vizinhos próximos (opcional - pode ativar depois) */}
          {/* Lines conectando hexágonos adjacentes seriam adicionadas aqui */}
        </motion.svg>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <motion.div 
            className="mb-4 space-y-1"
            key={activeHex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white/90 text-2xl font-mono font-bold">
              {getHexInfo(activeHex).name}
            </p>
            <p className={`text-xs font-light tracking-wider ${
              getHexInfo(activeHex).state === 'locked' ? 'text-red-400' :
              getHexInfo(activeHex).state === 'available' ? 'text-cyan-400' :
              getHexInfo(activeHex).state === 'completed' ? 'text-green-400' : 'text-white/60'
            }`}>
              {getHexInfo(activeHex).requirements}
            </p>
          </motion.div>
          
          <div className="mt-4 space-y-2">
            <p className="text-white/60 text-sm">
              4 Grupos • 34 Hexágonos • Sistema Progressivo de Desenvolvimento
            </p>
            
            {/* Progress Summary */}
            <div className="flex items-center gap-4 text-xs">
              <div className={`flex items-center gap-1 ${userProgress.personaCompleted ? 'text-green-400' : 'text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${userProgress.personaCompleted ? 'bg-green-400' : 'bg-red-400'}`} />
                Persona: {userProgress.personaCompleted ? 'Completa' : 'Pendente'}
              </div>
              <div className="text-cyan-400">ALMA: {userProgress.almaModules}/19</div>
              <div className="text-purple-400">Vortex: {userProgress.vortexModules}/7</div>
              <div className="text-amber-400">Odisseia: {userProgress.odisseiaModules}/7</div>
            </div>

            {/* Debug buttons for testing */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setUserProgress(prev => ({ ...prev, almaModules: Math.min(prev.almaModules + 1, 19) }))}
                className="px-2 py-1 bg-cyan-600/20 text-cyan-400 text-xs border border-cyan-600/50 rounded hover:bg-cyan-600/30"
              >
                +ALMA
              </button>
              <button
                onClick={() => setUserProgress(prev => ({ ...prev, vortexModules: Math.min(prev.vortexModules + 1, 7) }))}
                className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs border border-purple-600/50 rounded hover:bg-purple-600/30"
              >
                +Vortex
              </button>
              <button
                onClick={() => setUserProgress(prev => ({ ...prev, odisseiaModules: Math.min(prev.odisseiaModules + 1, 7) }))}
                className="px-2 py-1 bg-amber-600/20 text-amber-400 text-xs border border-amber-600/50 rounded hover:bg-amber-600/30"
              >
                +Odisseia
              </button>
              <button
                onClick={() => setUserProgress({ personaCompleted: true, almaModules: 0, vortexModules: 0, odisseiaModules: 0 })}
                className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs border border-gray-600/50 rounded hover:bg-gray-600/30"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Controles de Zoom */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 2 }}
          >
            <motion.button
              onClick={zoomToGlobal}
              className={`px-6 py-2 border border-white/30 text-white/70 text-sm font-light tracking-wider transition-all duration-300 ${
                zoomMode === 'global' ? 'bg-white/10 text-white border-white/50' : 'hover:bg-white/5 hover:text-white/90'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {zoomMode === 'global' ? '🌍 VISÃO GLOBAL' : 
               zoomMode === 'hex' ? '🔍 VOLTAR AO MAPA' : 
               '🔍 VOLTAR AO MAPA'}
            </motion.button>
            
            <div className="flex justify-center mt-4 space-x-2">
              {hexagonGroups.map((group, index) => (
                <motion.button
                  key={`zoom-${index}`}
                  onClick={() => zoomToGroup(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    zoomMode === index ? 'bg-white' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>
            
            {/* Indicador de zoom atual */}
            <p className="text-white/40 text-xs mt-2">
              {zoomMode === 'global' ? 'Visualização Global' : 
               zoomMode === 'hex' ? `Zoom no Hexágono ${focusedHex?.id}` :
               `Zoom em: ${hexagonGroups[zoomMode as number]?.title}`}
            </p>

            {/* Navigation instructions */}
            <div className="text-white/30 text-xs mt-4 space-y-1">
              <p>⌨️ Navegação: ESC (voltar) • ESPAÇO (zoom) • ← → (navegar)</p>
              <p>🖱️ Clique no hexágono para zoom detalhado</p>
            </div>
          </motion.div>
        </motion.div>


        {/* Achievement Notification */}
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-4 rounded-lg shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-bold">Conquista Desbloqueada!</h3>
                  <p className="text-sm opacity-90">Persona Única ativada com sucesso</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* BOTTOM BAR: Legacy Info & Hexagon Details */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            
            {/* Left: Page Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span>Mapa de Evolução</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div className="text-xs text-zinc-500">
                <span className="text-zinc-400">Sistema:</span> Hexagonal Legacy
              </div>
            </div>

            {/* Center: Hexagon Info */}
            {selectedHexInfo ? (
              <motion.div 
                className="flex items-center gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-xs text-white font-medium">{selectedHexInfo.title}</div>
                  <div className="text-xs text-zinc-400 mt-1">{selectedHexInfo.description}</div>
                </div>
                
                {selectedHexInfo.rewards && selectedHexInfo.rewards.length > 0 && (
                  <>
                    <div className="w-px h-8 bg-zinc-700" />
                    <div className="text-xs">
                      <div className="text-green-400 font-medium mb-1">Recursos Ativos:</div>
                      <div className="text-zinc-300">{selectedHexInfo.rewards.length} desbloqueados</div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-zinc-400">Clique em um hexágono</div>
                  <div className="text-xs text-zinc-500">para ver detalhes</div>
                </div>
              </div>
            )}

            {/* Right: Progress Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${userProgress.personaCompleted ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-xs text-zinc-400">Persona: {userProgress.personaCompleted ? 'Ativa' : 'Pendente'}</span>
              </div>
              <div className="w-px h-4 bg-zinc-800" />
              <div className="text-xs text-zinc-500">
                <span className="text-zinc-400">Progresso:</span> {userProgress.almaModules + userProgress.vortexModules + userProgress.odisseiaModules}/33
              </div>
            </div>
          </div>

          {/* Expanded info when hexagon is selected */}
          {selectedHexInfo?.rewards && (
            <motion.div 
              className="border-t border-zinc-800/50 pt-3 mt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-green-400 font-medium mb-2">Recursos Desbloqueados:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedHexInfo.rewards.map((reward: string, index: number) => (
                      <span key={index} className="text-xs bg-green-950/30 text-green-300 px-2 py-1 rounded border border-green-800/30">
                        ✓ {reward}
                      </span>
                    ))}
                  </div>
                </div>
                
                {selectedHexInfo.nextSteps && (
                  <div>
                    <div className="text-xs text-yellow-400 font-medium mb-2">Próximos Passos:</div>
                    <p className="text-xs text-yellow-200/80 leading-relaxed">{selectedHexInfo.nextSteps}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      </div>
    </AppLayout>
  )
}