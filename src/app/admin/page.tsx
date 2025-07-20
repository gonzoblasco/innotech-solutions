'use client'
import { useState, useEffect } from 'react'

type Section = 'dashboard' | 'users' | 'conversations' | 'agents' | 'settings'

export default function AdminPage() {
  const [stats, setStats] = useState({ total: 0 })
  const [password, setPassword] = useState('')
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  useEffect(() => {
    if (authorized) {
      loadStats()
    }
  }, [authorized])

  const loadStats = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
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

  const navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Usuarios', icon: '👥' },
    { id: 'conversations', label: 'Conversaciones', icon: '💬' },
    { id: 'agents', label: 'Agentes', icon: '🤖' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ]

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flex: '1 1 200px',
    minWidth: '200px',
  }

  const linkBase = {
    padding: '10px 15px',
    margin: '5px 0',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap' as const,
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

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
        zIndex: 9999,
      }}>
        <div style={{
          padding: '40px',
          border: '2px solid #000',
          backgroundColor: '#f0f0f0',
          textAlign: 'center',
        }}>
          <h1 style={{ color: '#000', fontSize: '24px', margin: '0 0 20px 0' }}>
            🔒 ADMIN INNOTECH
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            style={{
              padding: '10px',
              fontSize: '16px',
              border: '2px solid #000',
              marginBottom: '20px',
              width: '200px',
            }}
          />
          <br />
          <button
            onClick={() => {
              if (password === 'admin123') {
                setAuthorized(true)
              } else {
                alert('❌ Incorrecto')
                setPassword('')
              }
            }}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007acc',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ENTRAR
          </button>
        </div>
      </div>
    )
  }

  const showSidebar = !isMobile || sidebarOpen

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#e5e7eb' }}>
      {showSidebar && (
        <aside
          style={{
            width: '220px',
            backgroundColor: '#0f172a',
            color: 'white',
            padding: '20px 10px',
            display: 'flex',
            flexDirection: 'column',
            position: isMobile ? 'fixed' : 'relative',
            height: '100%',
            zIndex: 1000,
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '20px', paddingLeft: '5px' }}>
            🔧 Admin
          </div>
          <nav style={{ flex: 1 }}>
            {navItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setActive(item.id)
                  if (isMobile) setSidebarOpen(false)
                }}
                style={{
                  ...linkBase,
                  backgroundColor: active === item.id ? '#1e40af' : 'transparent',
                }}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
          <a
            href="/"
            style={{ ...linkBase, marginTop: 'auto', color: 'white', textDecoration: 'none' }}
          >
            ← Volver al sitio
          </a>
        </aside>
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header
          style={{
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}
        >
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                fontSize: '20px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              ☰
            </button>
          )}
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            {active === 'dashboard' ? 'Dashboard' : `Dashboard / ${capitalize(active)}`}
          </div>
          <div>👤 Admin</div>
        </header>
        <main style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {active === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
                <div style={cardStyle as React.CSSProperties}>
                  <h3 style={{ marginBottom: '10px' }}>👥 Usuarios</h3>
                  <p>Próximamente</p>
                </div>
                <div style={cardStyle as React.CSSProperties}>
                  <h3 style={{ marginBottom: '10px' }}>💬 Conversaciones</h3>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                    {loading ? 'Cargando...' : stats.total}
                  </p>
                  <button
                    onClick={loadStats}
                    disabled={loading}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007acc',
                      color: 'white',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                  >
                    🔄 Actualizar
                  </button>
                </div>
                <div style={cardStyle as React.CSSProperties}>
                  <h3 style={{ marginBottom: '10px' }}>🤖 Uso por Agente</h3>
                  <p>Próximamente</p>
                </div>
              </div>
              <div
                style={{
                  ...cardStyle,
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                } as React.CSSProperties}
              >
                📈 Gráfico próximamente
              </div>
              <div
                style={{
                  marginTop: '20px',
                  border: '1px solid #cc0000',
                  backgroundColor: '#fff0f0',
                  padding: '20px',
                  borderRadius: '8px',
                }}
              >
                <h3 style={{ color: '#cc0000', marginBottom: '10px' }}>🗑️ Zona Peligrosa</h3>
                <button
                  onClick={deleteAll}
                  disabled={loading || stats.total === 0}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: stats.total === 0 ? '#ccc' : '#cc0000',
                    color: 'white',
                    border: 'none',
                    cursor: loading || stats.total === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                  }}
                >
                  {loading ? '⏳ Eliminando...' : `🚨 Eliminar Todo (${stats.total})`}
                </button>
              </div>
            </div>
          )}

          {active !== 'dashboard' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{capitalize(active)}</h2>
              <p>Próximamente</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
