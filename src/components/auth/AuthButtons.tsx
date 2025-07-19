'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function AuthButtons() {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-gray-600">Cargando...</span>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Hola, <span className="font-medium">{user.email}</span>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Mi Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => {
            setAuthMode('login')
            setShowAuth(true)
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Iniciar Sesión
        </button>
        <button
          onClick={() => {
            setAuthMode('register')
            setShowAuth(true)
          }}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Registrarse Gratis
        </button>
      </div>

      {/* Auth Modal */}
      {showAuth && typeof window !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAuth(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {authMode === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => setAuthMode('register')}
                onClose={() => setShowAuth(false)}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setAuthMode('login')}
                onClose={() => setShowAuth(false)}
              />
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}