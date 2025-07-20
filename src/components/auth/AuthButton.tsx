// components/auth/AuthButton.tsx
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

const ADMIN_EMAILS = ['tu-email@gmail.com'] // ← CAMBIAR POR TU EMAIL

export default function AuthButton() {
  const { user, signIn, signUp, signOut, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false) // ← NUEVO
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('') // ← NUEVO
  const [isLoading, setIsLoading] = useState(false)

  if (loading) {
    return <div className="text-sm text-gray-500">⏳</div>
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">
          👋 {user.email?.split('@')[0]}
        </span>

        {ADMIN_EMAILS.includes(user.email || '') && (
          <a href="/admin" className="text-xs text-purple-600 hover:underline">
            🔧 Admin
          </a>
        )}

        <button
          onClick={signOut}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Salir
        </button>
      </div>
    )
  }

  if (!showLogin) {
    return (
      <button
        onClick={() => setShowLogin(true)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
      >
        Iniciar Sesión
      </button>
    )
  }

  const handleAuth = async () => {
    setIsLoading(true)

    if (isRegistering) {
      const { error } = await signUp(email, password, fullName)
      if (error) {
        alert(error.message)
      } else {
        alert('✅ Registro exitoso! Revisa tu email para confirmar la cuenta.')
        setShowLogin(false)
        setEmail('')
        setPassword('')
        setFullName('')
        setIsRegistering(false)
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        alert(error.message)
      } else {
        setShowLogin(false)
        setEmail('')
        setPassword('')
      }
    }

    setIsLoading(false)
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-lg absolute right-0 top-full mt-2 w-72 z-50">
      <h3 className="font-semibold mb-3">
        {isRegistering ? '✨ Registro' : '🔑 Iniciar Sesión'}
      </h3>

      <div className="space-y-3">
        {isRegistering && (
          <input
            type="text"
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <button
            onClick={handleAuth}
            disabled={isLoading}
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '⏳' : (isRegistering ? 'Registrarse' : 'Entrar')}
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        {/* Toggle entre login y registro */}
        <div className="text-center border-t pt-3">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-blue-600 hover:underline"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  )
}