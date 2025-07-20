// src/app/test-supabase/page.tsx - CREAR ESTE ARCHIVO TEMPORAL
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Testing Supabase connection...')

        // Test 1: Client creation
        const supabase = createClient()
        console.log('✅ Supabase client created')
        setStatus('Client created, testing connection...')

        // Test 2: Simple query
        const { data, error } = await supabase
          .from('conversations')
          .select('count', { count: 'exact', head: true })

        if (error) {
          console.error('❌ Connection error:', error)
          setError(`Connection failed: ${error.message}`)
          setStatus('Connection failed')
        } else {
          console.log('✅ Connection successful, conversations count:', data)
          setStatus('Connection successful!')
        }

      } catch (err) {
        console.error('💥 Unexpected error:', err)
        setError(`Unexpected error: ${err}`)
        setStatus('Unexpected error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>

        <div className="space-y-4">
          <div>
            <strong>Status:</strong> {status}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="text-sm text-gray-600">
            <strong>Environment Check:</strong>
            <ul className="mt-2 space-y-1">
              <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
              <li>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}