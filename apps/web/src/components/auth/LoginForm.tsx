"use client"

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido'
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }
    
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formErrors = validateForm()
    setErrors(formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setStatusMessage('Verificando credenciais...')
    
    // Simulate API call delay for demo
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setStatusMessage('Login realizado com sucesso! Redirecionando...')
    
    startTransition(() => {
      router.push('/')
    })
  }

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Screen reader status region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {statusMessage}
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">
          Bem-vindo de volta
        </h2>
        <p className="text-slate-600 text-sm">
          Acesse sua conta para continuar navegando
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              className={`pl-10 h-12 text-base transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              disabled={isSubmitting}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <motion.p 
              id="email-error"
              className="text-sm text-red-600 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              role="alert"
            >
              {errors.email}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Label htmlFor="password" className="text-sm font-medium text-slate-700">
            Senha
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange('password')}
              className={`pl-10 pr-10 h-12 text-base transition-all duration-200 ${
                errors.password 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                  : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20'
              }`}
              disabled={isSubmitting}
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              disabled={isSubmitting}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <motion.p 
              id="password-error"
              className="text-sm text-red-600 flex items-center gap-1"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              role="alert"
            >
              {errors.password}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:opacity-60"
          >
            {isSubmitting || isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Entrar
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-500 font-medium">
            Demo
          </span>
        </div>
      </motion.div>

      {/* Demo Notice */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <p className="text-xs text-slate-500 leading-relaxed">
          Esta é uma versão de demonstração. Qualquer email e senha válidos irão redirecioná-lo para a página principal.
        </p>
      </motion.div>
    </div>
  )
}