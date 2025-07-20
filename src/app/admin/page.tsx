// app/admin/page.tsx - Versión con estilos forzados
'use client'
import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [stats, setStats] = useState({ total: 0 })
  const [password, setPassword] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authorized) {
      loadStats()
    }
  }, [authorized])

  const loadStats = async () => {
    setLoading(true)
    try {
      console.log('📊 Loading stats...')
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      console.log('📊 Stats loaded:', data)
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAll = async () => {
    if (!confirm(`¿Eliminar todas las ${stats.total} conversaciones?`)) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/delete-all', { method: 'POST' })
      const data = await response.json()

      if (data.success) {
        alert('✅ Eliminadas!')
        loadStats()
      } else {
        alert('❌ Error: ' + data.error)
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert('❌ Error: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!authorized) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          padding: '40px',
          border: '2px solid #000',
          backgroundColor: '#f0f0f0',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#000', fontSize: '24px', margin: '0 0 20px 0' }}>
            🔒 ADMIN INNOTECH
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (password === 'admin123') {
                setAuthorized(true)
              } else {
                alert('❌ Incorrecto')
                setPassword('')
              }
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña de administrador"
              style={{
                padding: '10px',
                fontSize: '16px',
                border: '2px solid #000',
                marginBottom: '20px',
                width: '200px'
              }}
              className="text-gray-900 placeholder:text-gray-600"
            />
            <br />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#007acc',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      padding: '20px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <h1 style={{ color: '#000', fontSize: '32px', margin: '0 0 30px 0' }}>
        🔧 ADMIN INNOTECH
      </h1>

      <div style={{
        border: '3px solid #000',
        padding: '30px',
        marginBottom: '30px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2 style={{ color: '#000', fontSize: '24px', margin: '0 0 20px 0' }}>
          📊 ESTADÍSTICAS
        </h2>
        <p style={{ color: '#000', fontSize: '32px', fontWeight: 'bold', margin: '20px 0' }}>
          {loading ? '⏳ CARGANDO...' : `💬 CONVERSACIONES: ${stats.total}`}
        </p>
        <button
          onClick={loadStats}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '20px'
          }}
        >
          🔄 ACTUALIZAR
        </button>
      </div>

      <div style={{
        border: '3px solid #cc0000',
        padding: '30px',
        marginBottom: '30px',
        backgroundColor: '#fff0f0'
      }}>
        <h2 style={{ color: '#cc0000', fontSize: '24px', margin: '0 0 20px 0' }}>
          🗑️ ZONA PELIGROSA
        </h2>
        <button
          onClick={deleteAll}
          disabled={loading || stats.total === 0}
          style={{
            padding: '20px 40px',
            fontSize: '20px',
            backgroundColor: stats.total === 0 ? '#ccc' : '#cc0000',
            color: 'white',
            border: 'none',
            cursor: (loading || stats.total === 0) ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ ELIMINANDO...' : `🚨 ELIMINAR TODO (${stats.total})`}
        </button>
      </div>

      <a
        href="/"
        style={{
          color: '#007acc',
          fontSize: '18px',
          textDecoration: 'underline',
          display: 'block',
          marginTop: '20px'
        }}
      >
        ← VOLVER AL SITIO
      </a>
    </div>
  )
}