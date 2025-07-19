// src/app/test-auth/page.tsx - CREAR ESTE ARCHIVO
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function TestAuth() {
  const [logs, setLogs] = useState<string[]>([])
  const [status, setStatus] = useState('Starting auth test...')

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const testAuth = async () => {
      try {
        addLog('🧪 Starting Supabase Auth test...')

        const supabase = createClient()
        addLog('✅ Supabase client created')

        // Test 1: getSession with timeout
        addLog('🔄 Testing getSession()...')
        setStatus('Testing getSession...')

        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('getSession timeout after 10 seconds')), 10000)
        )

        const sessionResult = await Promise.race([sessionPromise, timeoutPromise])

        addLog('✅ getSession completed successfully')
        addLog(`📋 Session result: ${sessionResult.data.session ? 'User logged in' : 'No active session'}`)

        // Test 2: Auth state listener
        addLog('👂 Setting up auth state listener...')
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          addLog(`🔄 Auth state change: ${event} - ${session?.user?.email || 'No user'}`)
        })

        setStatus('Auth test completed successfully!')
        addLog('✅ All auth tests passed')

        // Cleanup after 5 seconds
        setTimeout(() => {
          subscription.unsubscribe()
          addLog('🛑 Test completed, listener cleaned up')
        }, 5000)

      } catch (error: any) {
        addLog(`❌ Auth test failed: ${error.message}`)
        setStatus(`Auth test failed: ${error.message}`)
      }
    }

    testAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-4">Supabase Auth Test</h1>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <strong>Status:</strong> {status}
          </div>

          <div>
            <strong>Live Logs:</strong>
            <div className="mt-2 p-3 bg-gray-50 border rounded max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Test Plan:</strong></p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Create Supabase client</li>
              <li>Test getSession() with 10s timeout</li>
              <li>Setup auth state listener</li>
              <li>Monitor for auth events</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}