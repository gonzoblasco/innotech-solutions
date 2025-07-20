'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { user, login, register } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/'

  // Si ya está logueado, redirect
  useEffect(() => {
    if (user) {
      router.push(returnTo)
    }
  }, [user, router, returnTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isRegistering) {
        await register(email, password)
        // El redirect se maneja en el useEffect
      } else {
        await login(email, password)
        // El redirect se maneja en el useEffect
      }
    } catch (err: any) {
      setError(err.message || 'Error en autenticación')
    } finally {
      setLoading(false)
    }
  }

  // Si ya está logueado, mostrar loading
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header con navegación */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-900">InnoTech Solutions</span>
            </Link>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex items-center justify-center p-4 pt-12">
        <div className="max-w-md w-full">

          {/* Card principal */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">
                {isRegistering ? '🚀' : '🔐'}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </h1>
              <p className="text-gray-600">
                {isRegistering
                  ? 'Accede a todos nuestros agentes especializados'
                  : 'Bienvenido de vuelta a InnoTech Solutions'
                }
              </p>
            </div>

            {/* Value proposition para registro */}
            {isRegistering && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ¿Por qué crear una cuenta?
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center">
                    <span className="mr-2">💬</span>
                    <span>Acceso completo a 4 agentes especializados</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">💾</span>
                    <span>Historial de conversaciones guardado</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🔄</span>
                    <span>Continuidad entre dispositivos</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🆓</span>
                    <span><strong>100% gratuito, sin compromisos</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Mostrar return URL si existe */}
            {returnTo && returnTo !== '/' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <p className="text-yellow-800 text-sm">
                  <strong>Nota:</strong> Después del {isRegistering ? 'registro' : 'login'},
                  serás redirigido a tu agente seleccionado.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={isRegistering ? "Mínimo 6 caracteres" : "Tu contraseña"}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </span>
                ) : (
                  isRegistering ? 'Crear Cuenta Gratuita' : 'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Toggle entre login y registro */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setError('') // Limpiar errores al cambiar modo
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
              >
                {isRegistering
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate gratis'
                }
              </button>
            </div>
          </div>

          {/* Footer con seguridad */}
          <div className="text-center mt-6">
            <p className="text-blue-700 text-sm">
              🔒 Tus datos están seguros • 🆓 Completamente gratuito • ❌ Sin spam
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}