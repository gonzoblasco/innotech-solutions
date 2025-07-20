'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface AuthButtonProps {
  variant?: 'header' | 'chat' | 'minimal'
  className?: string
}

export default function AuthButton({ variant = 'header', className = '' }: AuthButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, login, register, logout } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegistering) {
        await register(email, password)
      } else {
        await login(email, password)
      }

      // Limpiar form y cerrar dropdown
      setEmail('')
      setPassword('')
      setShowDropdown(false)
    } catch (err: any) {
      setError(err.message || 'Error en autenticación')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
    setLoading(false)
  }

  const toggleMode = () => {
    setIsRegistering(!isRegistering)
    resetForm()
  }

  // ESTADO LOGUEADO
  if (user) {
    // Variant para chat (más compacto)
    if (variant === 'chat') {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <span className="text-xs text-gray-600">
            {user.email?.split('@')[0]}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Salir
          </button>
        </div>
      )
    }

    // Variant para header (normal)
    if (variant === 'header') {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
          <span className="text-sm text-gray-700">
            👋 {user.email?.split('@')[0]}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            Salir
          </button>
          {user.email === 'gonzoblasco@gmail.com' && (
            <Link
              href="/admin"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      )
    }

    // Variant minimal (solo salir)
    if (variant === 'minimal') {
      return (
        <button
          onClick={handleLogout}
          className={`text-sm text-red-600 hover:text-red-700 ${className}`}
        >
          Salir
        </button>
      )
    }
  }

  // ESTADO NO LOGUEADO
  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setShowDropdown(!showDropdown)}
        className={
          variant === 'chat'
            ? "bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
            : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        }
      >
        {variant === 'chat' ? 'Login' : 'Iniciar Sesión'}
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
        >
          <div className="p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isRegistering
                  ? 'Acceso completo a todos los agentes'
                  : 'Bienvenido de vuelta'
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder={isRegistering ? "Mínimo 6 caracteres" : "Tu contraseña"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </span>
                ) : (
                  isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                {isRegistering
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate gratis'
                }
              </button>
            </div>

            {isRegistering && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Datos seguros • 🆓 Completamente gratuito
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}