"use client"

/**
 * 🎮 HEXAGON TEST - Three.js Version
 * Estilo minimalista black & white, line-art como a página de login
 */

import React, { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HexTestThreeProps {
  userName?: string
}

// Componente Hexágono 3D
function ThreeHexagon({ 
  position,
  size = 0.8,
  isActive = false,
  onClick 
}: { 
  position: [number, number, number]
  size?: number
  isActive?: boolean
  onClick?: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Criar geometria hexagonal
  const hexGeometry = useMemo(() => {
    const shape = new THREE.Shape()
    
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6
      const x = Math.cos(angle) * size
      const y = Math.sin(angle) * size
      
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    }
    shape.closePath()
    
    return new THREE.ShapeGeometry(shape)
  }, [size])
  
  // Animação
  useFrame((state) => {
    if (meshRef.current) {
      // Rotação quando ativo
      if (isActive) {
        meshRef.current.rotation.z = state.clock.elapsedTime
      }
      
      // Hover effect
      const targetScale = hovered ? 1.1 : isActive ? 1.05 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.1)
    }
  })
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      geometry={hexGeometry}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <meshBasicMaterial 
        color="white" 
        transparent 
        opacity={isActive ? 0.1 : 0.05}
        side={THREE.DoubleSide}
      />
      
      {/* Outline do hexágono */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[hexGeometry]} />
        <lineBasicMaterial 
          attach="material" 
          color="white" 
          opacity={isActive ? 1 : 0.7}
          transparent
        />
      </lineSegments>
      
      {/* Ponto central */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[isActive ? 0.08 : 0.04, 16]} />
        <meshBasicMaterial 
          color="white" 
          opacity={isActive ? 1 : 0.5}
          transparent
        />
      </mesh>
    </mesh>
  )
}

// Partículas de fundo
function BackgroundParticles() {
  const particlesRef = useRef<THREE.Points>(null)
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(50 * 3)
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return positions
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.05
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePositions.length / 3}
          array={particlePositions}
          itemSize={3}
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="white"
        transparent
        opacity={0.1}
        sizeAttenuation
      />
    </points>
  )
}

export function HexTestThree({ userName = "Captain" }: HexTestThreeProps) {
  const [activeHex, setActiveHex] = useState<number | null>(0)
  
  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center">
      {/* Header minimalista */}
      <div className="absolute top-8 text-center z-10">
        <h1 className="text-2xl font-light text-white/90 tracking-wide">
          HEXAGON TEST
        </h1>
        <p className="text-sm text-white/50 mt-2 font-light">
          Three.js • {userName}
        </p>
      </div>
      
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        style={{ background: 'black' }}
      >
        <BackgroundParticles />
        
        {/* Hexágono central */}
        <ThreeHexagon
          position={[0, 0, 0]}
          size={1.2}
          isActive={activeHex === 0}
          onClick={() => setActiveHex(0)}
        />
        
        {/* Honeycomb ao redor - primeira camada */}
        {[...Array(6)].map((_, i) => {
          const angle = (Math.PI / 3) * i
          const x = Math.cos(angle) * 2.5
          const y = Math.sin(angle) * 2.5
          
          return (
            <ThreeHexagon
              key={`ring1-${i}`}
              position={[x, y, 0]}
              size={0.9}
              isActive={activeHex === i + 1}
              onClick={() => setActiveHex(i + 1)}
            />
          )
        })}
        
        {/* Conexões 3D */}
        {activeHex !== null && (
          <>
            {[...Array(6)].map((_, i) => {
              const angle = (Math.PI / 3) * i
              const x = Math.cos(angle) * 2.5
              const y = Math.sin(angle) * 2.5
              
              return (
                <line key={`connection-${i}`}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([0, 0, 0, x, y, 0])}
                      itemSize={3}
                      args={[new Float32Array([0, 0, 0, x, y, 0]), 3]}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial
                    color="white"
                    opacity={0.2}
                    transparent
                  />
                </line>
              )
            })}
          </>
        )}
      </Canvas>
      
      {/* Info panel minimalista */}
      <div className="absolute bottom-8 text-center z-10">
        <p className="text-white/70 text-sm font-light">
          {activeHex !== null ? `HEXAGON ${activeHex} SELECTED` : 'SELECT A HEXAGON'}
        </p>
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeHex === i ? 'bg-white' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}