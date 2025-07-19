// src/app/test-auth/page.tsx - Crear para testing
'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function TestAuth() {
  const { user, profile, loading, signUp, signIn, signOut } = useAuth()

  if (loading) {
    return <div className="p-8">Loading auth state...</div>
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>

      {user ? (
        <div className="space-y-4">
          <p className="text-green-600">✅ User logged in!</p>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
          {profile && <p>Name: {profile.full_name}</p>}

          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-red-600">❌ No user logged in</p>

          <button
            onClick={() => signUp('test@test.com', 'password123', 'Test User')}
            className="bg-blue-500 text-white px-4 py-2 rounded block"
          >
            Test Sign Up
          </button>

          <button
            onClick={() => signIn('test@test.com', 'password123')}
            className="bg-green-500 text-white px-4 py-2 rounded block"
          >
            Test Sign In
          </button>
        </div>
      )}
    </div>
  )
}