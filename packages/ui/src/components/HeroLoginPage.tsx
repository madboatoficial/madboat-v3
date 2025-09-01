"use client"

import React, { useState, useEffect } from 'react'
import { ShipWheel, ArrowRight, Compass, Eye, EyeOff, CheckCircle2, AlertCircle, Info } from 'lucide-react'

interface HeroLoginPageProps {
  onSubmit: (data: { email: string; password: string }) => void
  onSignUp: (data: { email: string; password: string }) => void
  loading?: boolean
  error?: string
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
}

// Design instrutivo: Sistema de contexto adaptativo
interface ContextualGuidance {
  phase?: 'orientation' | 'input' | 'validation' | 'action'
  message: string
  type: 'info' | 'success' | 'warning'
  world: 'alma' | 'vortice' | 'odisseia'
}

export function HeroLoginPage({
  onSubmit,
  onSignUp,
  loading = false,
  error,
  mode,
  onModeChange
}: HeroLoginPageProps) {
  // Estados básicos
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  
  // Estados de design instrutivo
  const [showPassword, setShowPassword] = useState(false)
  const [guidance, setGuidance] = useState<ContextualGuidance | null>(null)
  const [userExperience, setUserExperience] = useState<'novice' | 'intermediate' | 'expert'>('novice')
  const [currentWorld, setCurrentWorld] = useState<'alma' | 'vortice' | 'odisseia'>('alma')
  const [interactionCount, setInteractionCount] = useState(0)
  const [showAdvancedTips, setShowAdvancedTips] = useState(false)
  const [transformationPhase, setTransformationPhase] = useState<'awakening' | 'growing' | 'mastering'>('awakening')
  
  // Validação educativa progressiva
  const [emailValidation, setEmailValidation] = useState<'neutral' | 'valid' | 'invalid'>('neutral')
  const [passwordValidation, setPasswordValidation] = useState<'neutral' | 'valid' | 'invalid'>('neutral')

  // Design instrutivo: Sistema de orientação contextual
  const getGuidanceForPhase = (phase: NonNullable<ContextualGuidance['phase']>, mode: 'login' | 'signup'): ContextualGuidance => {
    const guidanceMap = {
      orientation: {
        login: { 
          phase: 'orientation' as const,
          message: currentWorld === 'alma' ? "Bem-vindo de volta ao A.L.M.A. Sua consciência está despertando novamente." :
                   currentWorld === 'vortice' ? "Retorne ao Vórtice. Sua transformação está em movimento." :
                   "Volte à Odisseia. Seu domínio aguarda por você.",
          type: 'info' as const,
          world: currentWorld
        },
        signup: { 
          phase: 'orientation' as const,
          message: currentWorld === 'alma' ? "Desperte para o A.L.M.A. Sua jornada de autoconhecimento começa agora." :
                   currentWorld === 'vortice' ? "Entre no Vórtice. A transformação é um processo em espiral." :
                   "Inicie a Odisseia. Todo herói precisa dar o primeiro passo.",
          type: 'info' as const,
          world: currentWorld
        }
      },
      input: {
        login: { 
          phase: 'input' as const,
          message: transformationPhase === 'awakening' ? "Digite suas credenciais. Cada entrada é um despertar." :
                   transformationPhase === 'growing' ? "Acesse com segurança. Sua jornada está evoluindo." :
                   "Credenciais confirmadas. Bem-vindo de volta, navegador experiente.",
          type: 'info' as const,
          world: currentWorld
        },
        signup: { 
          phase: 'input' as const,
          message: currentWorld === 'alma' ? "Crie suas credenciais com consciência. Elas protegerão seus insights." :
                   currentWorld === 'vortice' ? "Estabeleça sua identidade no vórtice. Segurança é transformação." :
                   "Forje suas chaves de acesso. Todo herói precisa de proteção.",
          type: 'warning' as const,
          world: currentWorld
        }
      },
      validation: {
        login: { 
          phase: 'validation' as const,
          message: "Verificando sua identidade digital...",
          type: 'info' as const,
          world: currentWorld
        },
        signup: { 
          phase: 'validation' as const,
          message: "Preparando seu espaço de aprendizagem transformativa...",
          type: 'success' as const,
          world: currentWorld
        }
      },
      action: {
        login: { 
          phase: 'action' as const,
          message: "Entrando na sua jornada de transformação...",
          type: 'success' as const,
          world: currentWorld
        },
        signup: { 
          phase: 'action' as const,
          message: "Criando seu universo de possibilidades...",
          type: 'success' as const,
          world: currentWorld
        }
      }
    }
    return guidanceMap[phase][mode]
  }

  // Validação educativa em tempo real
  const validateEmail = (email: string): 'neutral' | 'valid' | 'invalid' => {
    if (email.length === 0) return 'neutral'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) ? 'valid' : 'invalid'
  }

  const validatePassword = (password: string): 'neutral' | 'valid' | 'invalid' => {
    if (password.length === 0) return 'neutral'
    return password.length >= 6 ? 'valid' : 'invalid'
  }

  // Detecção inteligente de experiência do usuário
  const detectUserExperience = () => {
    if (interactionCount < 3) return 'novice'
    if (interactionCount < 10) return 'intermediate'
    return 'expert'
  }

  // Sistema de adaptação progressiva
  const getTransformationPhase = () => {
    if (interactionCount < 2) return 'awakening'
    if (interactionCount < 8) return 'growing'
    return 'mastering'
  }

  // Detecção de padrões de aprendizado
  const shouldShowAdvancedTips = () => {
    return userExperience !== 'novice' && interactionCount > 5
  }

  // Effects para design instrutivo
  useEffect(() => {
    setGuidance(getGuidanceForPhase('orientation', mode))
    setUserExperience(detectUserExperience())
    setTransformationPhase(getTransformationPhase())
    setShowAdvancedTips(shouldShowAdvancedTips())
  }, [mode, interactionCount])

  useEffect(() => {
    setEmailValidation(validateEmail(email))
  }, [email])

  useEffect(() => {
    setPasswordValidation(validatePassword(password))
  }, [password])

  const handleInteraction = () => {
    setInteractionCount(prev => prev + 1)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    handleInteraction()
    if (guidance?.phase !== 'input') {
      setGuidance(getGuidanceForPhase('input', mode))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    handleInteraction()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setGuidance(getGuidanceForPhase('validation', mode))
    
    // Pequeno delay para mostrar feedback educativo
    setTimeout(() => {
      setGuidance(getGuidanceForPhase('action', mode))
      if (mode === 'login') {
        onSubmit({ email, password })
      } else {
        onSignUp({ email, password })
      }
    }, 300)
  }

  // Sistema cromático dos três mundos (Enhanced)
  const worldColors = {
    alma: {
      primary: 'from-blue-600 via-cyan-500 to-yellow-500',
      secondary: 'from-blue-400 to-cyan-300',
      accent: 'border-blue-400/40',
      text: 'text-blue-300',
      textSecondary: 'text-cyan-200',
      bg: 'bg-blue-900/15',
      bgSecondary: 'bg-cyan-900/10',
      shadow: 'shadow-blue-500/20',
      glow: 'shadow-blue-400/30'
    },
    vortice: {
      primary: 'from-purple-600 via-magenta-500 to-pink-500',
      secondary: 'from-purple-400 to-magenta-300',
      accent: 'border-purple-400/40',
      text: 'text-purple-300',
      textSecondary: 'text-magenta-200',
      bg: 'bg-purple-900/15',
      bgSecondary: 'bg-magenta-900/10',
      shadow: 'shadow-purple-500/20',
      glow: 'shadow-purple-400/30'
    },
    odisseia: {
      primary: 'from-red-600 via-orange-500 to-yellow-500',
      secondary: 'from-red-400 to-orange-300',
      accent: 'border-red-400/40',
      text: 'text-red-300',
      textSecondary: 'text-orange-200',
      bg: 'bg-red-900/15',
      bgSecondary: 'bg-orange-900/10',
      shadow: 'shadow-red-500/20',
      glow: 'shadow-red-400/30'
    }
  }

  const currentTheme = worldColors[currentWorld]

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background educativo multidimensional com os três mundos */}
      <div className="absolute inset-0">
        {/* Aura principal do mundo atual */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${currentTheme.bg} rounded-full blur-3xl transition-all duration-1000 opacity-40`} />
        
        {/* Aura secundária com movimento */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] ${currentTheme.bgSecondary} rounded-full blur-2xl transition-all duration-700 opacity-30 animate-pulse`} />
        
        {/* Partículas orbitais educativas */}
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-zinc-800/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-[150px] h-[150px] bg-zinc-700/5 rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 right-1/5 w-[100px] h-[100px] bg-zinc-600/5 rounded-full blur-md animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Reflexos dos outros mundos (sutis) */}
        {currentWorld !== 'alma' && (
          <div className="absolute top-1/6 left-1/6 w-[80px] h-[80px] bg-blue-900/5 rounded-full blur-xl animate-pulse opacity-20" style={{ animationDelay: '3s' }} />
        )}
        {currentWorld !== 'vortice' && (
          <div className="absolute bottom-1/6 right-1/6 w-[80px] h-[80px] bg-purple-900/5 rounded-full blur-xl animate-pulse opacity-20" style={{ animationDelay: '4s' }} />
        )}
        {currentWorld !== 'odisseia' && (
          <div className="absolute bottom-1/4 left-1/5 w-[80px] h-[80px] bg-red-900/5 rounded-full blur-xl animate-pulse opacity-20" style={{ animationDelay: '5s' }} />
        )}
      </div>
      
      <div className="relative z-10 w-full max-w-md mx-auto space-y-8">
        
        {/* Header educativo com contexto de mundo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-white tracking-wide">Mad</span>
            <div className="relative">
              <ShipWheel size={24} className="text-white animate-spin-slow" strokeWidth={2.5} />
              <Compass size={12} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${currentTheme.text} animate-pulse`} />
            </div>
            <span className="text-2xl font-bold text-white tracking-wide">Boat</span>
          </div>
          
          {/* Indicador de mundo atual com fase */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentTheme.primary} animate-pulse`} />
            <div className="text-center">
              <span className={`block text-sm font-medium ${currentTheme.text} uppercase tracking-wider`}>
                {currentWorld === 'alma' && 'A.L.M.A - Despertar'}
                {currentWorld === 'vortice' && 'Vórtice - Transformação'}
                {currentWorld === 'odisseia' && 'Odisseia - Domínio'}
              </span>
              <span className={`text-xs ${currentTheme.textSecondary} opacity-80 capitalize`}>
                Fase: {transformationPhase === 'awakening' ? 'Despertar' : transformationPhase === 'growing' ? 'Crescimento' : 'Maestria'}
              </span>
            </div>
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentTheme.secondary} animate-pulse`} style={{animationDelay: '0.5s'}} />
          </div>
        </div>

        {/* Sistema de orientação contextual */}
        {guidance && (
          <div className={`${currentTheme.bg} ${currentTheme.accent} border rounded-lg p-4 mb-6 transition-all duration-500 transform ${guidance ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {guidance.type === 'info' && <Info size={18} className={currentTheme.text} />}
                {guidance.type === 'success' && <CheckCircle2 size={18} className="text-green-400" />}
                {guidance.type === 'warning' && <AlertCircle size={18} className="text-yellow-400" />}
              </div>
              <p className={`text-sm ${guidance.type === 'success' ? 'text-green-300' : guidance.type === 'warning' ? 'text-yellow-300' : currentTheme.text} leading-relaxed`}>
                {guidance.message}
              </p>
            </div>
          </div>
        )}

        {/* Error message com design educativo */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium mb-1">Navegação interrompida</p>
                <p className="text-red-400 text-sm">{error}</p>
                <p className="text-red-500/70 text-xs mt-2">
                  Toda jornada tem obstáculos. Ajuste seu curso e tente novamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário educativo com validação progressiva */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Campo Email com affordances educativas */}
          <div className="relative">
            {/* Label semântica sempre visível */}
            <div className={`absolute -top-3 left-6 text-sm font-medium transition-all duration-300 ${
              emailFocused || email ? 'text-white opacity-100 scale-100' : 'text-zinc-500 opacity-70 scale-95'
            }`}>
              <span className="flex items-center gap-2">
                {mode === 'login' ? 'Suas Credenciais' : 'Novo Navegador'}
                {emailValidation === 'valid' && <CheckCircle2 size={14} className="text-green-400" />}
                {emailValidation === 'invalid' && email.length > 0 && <AlertCircle size={14} className="text-yellow-400" />}
              </span>
            </div>
            
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => {
                setEmailFocused(true)
                handleInteraction()
              }}
              onBlur={() => setEmailFocused(false)}
              className={`w-full h-14 bg-zinc-900/50 border-2 rounded-full px-6 text-white placeholder-zinc-500 focus:outline-none transition-all duration-300 text-center
                ${emailValidation === 'valid' ? 'border-green-500/50 focus:border-green-400 bg-green-900/10' : 
                  emailValidation === 'invalid' && email.length > 0 ? 'border-yellow-500/50 focus:border-yellow-400 bg-yellow-900/10' : 
                  `${currentTheme.accent} focus:${currentTheme.accent.replace('border-', 'border-').replace('/30', '/60')} ${currentTheme.bg}`}
              `}
              placeholder={emailFocused ? '' : (mode === 'login' ? 'email@exemplo.com' : 'seu.email@empresa.com')}
              required
              disabled={loading}
            />
            
            {/* Feedback educativo adaptativo para email */}
            {email.length > 0 && emailValidation === 'invalid' && (
              <div className="absolute -bottom-8 left-6 text-xs text-yellow-400 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>
                  {userExperience === 'novice' ? 'Formato de email incompleto' :
                   userExperience === 'intermediate' ? 'Email não reconhecido' :
                   'Formato inválido'}
                </span>
                {userExperience === 'novice' && (
                  <span className="ml-2 text-zinc-500">• exemplo@dominio.com</span>
                )}
              </div>
            )}
            {/* Dica educativa para emails válidos */}
            {emailValidation === 'valid' && showAdvancedTips && (
              <div className="absolute -bottom-6 left-6 text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 size={12} />
                <span>Navegador identificado</span>
              </div>
            )}
          </div>

          {/* Campo Senha com revelação educativa */}
          <div className="relative">
            {/* Label com indicador de força */}
            <div className={`absolute -top-3 left-6 text-sm font-medium transition-all duration-300 ${
              passwordFocused || password ? 'text-white opacity-100 scale-100' : 'text-zinc-500 opacity-70 scale-95'
            }`}>
              <span className="flex items-center gap-2">
                Chave de Acesso
                {passwordValidation === 'valid' && <CheckCircle2 size={14} className="text-green-400" />}
                {passwordValidation === 'invalid' && password.length > 0 && <AlertCircle size={14} className="text-yellow-400" />}
              </span>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => {
                  setPasswordFocused(true)
                  handleInteraction()
                }}
                onBlur={() => setPasswordFocused(false)}
                className={`w-full h-14 bg-zinc-900/50 border-2 rounded-full px-6 pr-14 text-white placeholder-zinc-500 focus:outline-none transition-all duration-300 text-center
                  ${passwordValidation === 'valid' ? 'border-green-500/50 focus:border-green-400 bg-green-900/10' : 
                    passwordValidation === 'invalid' && password.length > 0 ? 'border-yellow-500/50 focus:border-yellow-400 bg-yellow-900/10' : 
                    `${currentTheme.accent} focus:${currentTheme.accent.replace('border-', 'border-').replace('/30', '/60')} ${currentTheme.bg}`}
                `}
                placeholder={passwordFocused ? '' : '••••••••'}
                required
                disabled={loading}
              />
              
              {/* Toggle de visibilidade educativo */}
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            
            {/* Feedback educativo adaptativo para senha */}
            {password.length > 0 && passwordValidation === 'invalid' && (
              <div className="absolute -bottom-8 left-6 text-xs text-yellow-400 flex items-center gap-1">
                <AlertCircle size={12} />
                <span>
                  {userExperience === 'novice' ? 'Mínimo 6 caracteres para navegação segura' :
                   userExperience === 'intermediate' ? `${6 - password.length} caracteres restantes` :
                   'Fortalecimento necessário'}
                </span>
              </div>
            )}
            {/* Sistema de força de senha educativo */}
            {password.length > 0 && passwordValidation === 'valid' && mode === 'signup' && (
              <div className="absolute -bottom-6 left-6 text-xs flex items-center gap-2">
                <div className="flex gap-1">
                  <div className={`w-2 h-1 rounded ${password.length >= 6 ? 'bg-yellow-400' : 'bg-zinc-600'}`} />
                  <div className={`w-2 h-1 rounded ${password.length >= 8 ? 'bg-orange-400' : 'bg-zinc-600'}`} />
                  <div className={`w-2 h-1 rounded ${password.length >= 10 && /[A-Z]/.test(password) ? 'bg-green-400' : 'bg-zinc-600'}`} />
                </div>
                <span className={`${password.length >= 10 && /[A-Z]/.test(password) ? 'text-green-400' : password.length >= 8 ? 'text-orange-400' : 'text-yellow-400'}`}>
                  {password.length >= 10 && /[A-Z]/.test(password) ? 'Fortaleza Máxima' :
                   password.length >= 8 ? 'Boa Proteção' : 'Proteção Básica'}
                </span>
              </div>
            )}
          </div>

          {/* Botão de ação transformativo */}
          <div className="pt-8 space-y-4">
            <button
              type="submit"
              disabled={loading || (emailValidation !== 'valid' || passwordValidation !== 'valid')}
              className={`w-full h-14 font-semibold rounded-full transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed
                ${loading ? 'bg-zinc-700 text-zinc-300' : 
                  `bg-gradient-to-r ${currentTheme.primary} text-white hover:shadow-lg hover:shadow-${currentWorld === 'alma' ? 'blue' : currentWorld === 'vortice' ? 'purple' : 'red'}-500/25 hover:scale-[1.02]`}
              `}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin`} />
                  <span>{guidance?.message || 'Navegando...'}</span>
                </div>
              ) : (
                <>
                  {mode === 'login' ? 'Continuar Jornada' : 'Iniciar Odisseia'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            {/* Sistema de progresso adaptativo */}
            {(emailValidation !== 'valid' || passwordValidation !== 'valid') && (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${emailValidation === 'valid' ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-zinc-600'} transition-all duration-300`} />
                  <div className={`w-1 h-1 bg-zinc-700 rounded-full ${userExperience !== 'novice' ? 'opacity-30' : ''}`} />
                  <div className={`w-2 h-2 rounded-full ${passwordValidation === 'valid' ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-zinc-600'} transition-all duration-300`} />
                </div>
                <p className={`text-xs ${userExperience === 'novice' ? 'text-zinc-500' : 'text-zinc-600'}`}>
                  {userExperience === 'novice' ? 'Complete os campos para prosseguir' :
                   userExperience === 'intermediate' ? 'Finalize sua identificação' :
                   'Credenciais em validação'}
                </p>
                {transformationPhase === 'mastering' && (
                  <p className={`text-xs ${currentTheme.textSecondary} italic`}>
                    "A maestria está nos detalhes."
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sistema de alternância contextual */}
          <div className="text-center pt-8 space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-zinc-500 text-xs px-3">ou</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            
            <button
              type="button"
              onClick={() => {
                onModeChange(mode === 'login' ? 'signup' : 'login')
                handleInteraction()
                // Rotaciona entre mundos para novos usuários
                if (mode === 'login') {
                  const worlds: Array<'alma' | 'vortice' | 'odisseia'> = ['alma', 'vortice', 'odisseia']
                  const currentIndex = worlds.indexOf(currentWorld)
                  const nextWorld = worlds[(currentIndex + 1) % worlds.length]
                  setCurrentWorld(nextWorld)
                }
              }}
              className={`${currentTheme.text} text-sm hover:text-white transition-all duration-300 underline decoration-zinc-600 hover:decoration-current flex items-center justify-center gap-2 group`}
              disabled={loading}
            >
              {mode === 'login' ? (
                <>
                  <span>Primeira vez aqui?</span>
                  <span className="font-medium">Inicie sua jornada</span>
                </>
              ) : (
                <>
                  <span>Já é navegador?</span>
                  <span className="font-medium">Continue sua odisseia</span>
                </>
              )}
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Sistema de reconhecimento e dicas avançadas */}
          {userExperience !== 'novice' && (
            <div className="text-center pt-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
                <Compass size={12} className={`${currentTheme.text} animate-pulse`} />
                <span>Navegador {userExperience === 'intermediate' ? 'Experiente' : 'Mestre'}</span>
                <Compass size={12} className={`${currentTheme.text} animate-pulse`} style={{animationDelay: '0.5s'}} />
              </div>
              
              {/* Dicas contextuais avançadas */}
              {showAdvancedTips && transformationPhase === 'mastering' && (
                <div className={`${currentTheme.bgSecondary} ${currentTheme.accent} border rounded-lg p-3 mx-4`}>
                  <p className={`text-xs ${currentTheme.textSecondary} italic leading-relaxed`}>
                    {currentWorld === 'alma' && '"A consciência desperta reconhece padrões. Você está navegando com sabedoria."'}
                    {currentWorld === 'vortice' && '"Na transformação, cada movimento é intencional. Sua jornada evolui constantemente."'}
                    {currentWorld === 'odisseia' && '"O herói experiente conhece o poder das pequenas ações. Cada clique conta."'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Microinterações educativas para novatos */}
          {userExperience === 'novice' && interactionCount > 0 && interactionCount < 3 && (
            <div className="text-center pt-4">
              <div className={`${currentTheme.bg} ${currentTheme.accent} border rounded-lg p-3 mx-4`}>
                <p className={`text-xs ${currentTheme.text} flex items-center justify-center gap-2`}>
                  <Info size={12} />
                  <span>
                    {interactionCount === 1 && "Ótimo! Você está interagindo com a interface."}
                    {interactionCount === 2 && "Continue explorando. Cada campo tem seu propósito."}
                  </span>
                </p>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}