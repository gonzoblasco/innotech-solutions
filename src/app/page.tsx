'use client'

import Link from 'next/link'
import AuthButton from '@/components/auth/AuthButton'
import { useAuth } from '@/contexts/AuthContext'
import { agents } from '@/data/agents'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-900">
                InnoTech Solutions
              </h1>
            </div>
            <AuthButton variant="header" />
          </div>
        </div>
      </header>

      {/* Hero Section - SOLO para usuarios NO logueados */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!user && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Agentes de IA Especializados
              <span className="text-blue-600 block">para Profesionales LATAM</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Accede al expertise de consultores senior especializados, disponibles 24/7,
              por una fracción del costo tradicional. Sin conocimientos técnicos requeridos.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-blue-600 font-semibold">⚡ Respuesta Instantánea</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-green-600 font-semibold">🌎 Especializado LATAM</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-purple-600 font-semibold">🕐 Disponible 24/7</span>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje sobre registro requerido - SOLO para usuarios NO logueados */}
        {!user && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">
                  🔐 Acceso Protegido para Máxima Calidad
                </h3>
                <p className="mb-4 opacity-90">
                  Nuestros agentes especializados requieren registro gratuito para garantizar
                  continuidad, personalización y la mejor experiencia posible.
                </p>
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-lg mb-1">💬</div>
                    <div className="font-medium">Conversaciones Ilimitadas</div>
                    <div className="opacity-75">Con todos los agentes</div>
                  </div>
                  <div>
                    <div className="text-lg mb-1">💾</div>
                    <div className="font-medium">Historial Completo</div>
                    <div className="opacity-75">Nunca pierdas consultas</div>
                  </div>
                  <div>
                    <div className="text-lg mb-1">🔄</div>
                    <div className="font-medium">Multi-dispositivo</div>
                    <div className="opacity-75">Acceso desde cualquier lugar</div>
                  </div>
                  <div>
                    <div className="text-lg mb-1">🆓</div>
                    <div className="font-medium">100% Gratuito</div>
                    <div className="opacity-75">Sin compromisos</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agents Gallery */}
        <div className={user ? "mb-16 mt-8" : "mb-16"}>
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {user ? "Tus Agentes Especializados" : "Nuestros Agentes Especializados"}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agents.map((agent) => (
              <div key={agent.id} className="group">
                <Link href={`/chat?agent=${agent.id}`}>
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer transform hover:-translate-y-1">
                    <div className="text-center">
                      <div className="text-4xl mb-4">{agent.avatar}</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {agent.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {agent.description}
                      </p>
                      <div className="flex flex-wrap gap-1 justify-center mb-4">
                        {agent.tags?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        )) || []}
                      </div>
                      <div className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium group-hover:bg-blue-700 transition-colors">
                        Consultar Ahora
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Información adicional sobre registro - SOLO para usuarios NO logueados */}
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto mb-12">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 text-center">
              📝 ¿Por qué necesitas crear una cuenta?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Registro en menos de 30 segundos</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Historial de conversaciones seguro</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Acceso desde cualquier dispositivo</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Experiencia personalizada</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Completamente gratuito</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">✅</span>
                  <span>Datos protegidos y privados</span>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <Link
                href="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Crear Cuenta Gratuita
              </Link>
            </div>
          </div>
        )}

        {/* CTA Section - SOLO para usuarios NO logueados */}
        {!user && (
          <div className="text-center bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Comienza Ahora - Es Completamente Gratuito
            </h3>
            <p className="text-gray-600 mb-6">
              Únete a profesionales y emprendedores que ya están aprovechando
              el poder de la IA especializada para hacer crecer sus negocios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors inline-block"
              >
                Registrarse Ahora
              </Link>
              <Link
                href="/login"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-lg transition-colors inline-block"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © 2025 InnoTech Solutions. Democratizando el acceso a expertise profesional.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span>🔒 Datos seguros</span>
              <span>🆓 Completamente gratuito</span>
              <span>🌎 Especializado LATAM</span>
              <Link
                href="/admin"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}