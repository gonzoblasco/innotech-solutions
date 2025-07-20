// app/page.tsx - Fix del error de sintaxis
import {agents} from '@/data/agents'
import AuthButton from '@/components/auth/AuthButton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header con AuthButton */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IT</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">InnoTech Solutions</h1>
              <p className="text-sm text-gray-600">Agentes de IA Especializados</p>
            </div>
          </div>

          {/* AuthButton en el header */}
          <div className="relative">
            <AuthButton/>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Consultores Expertos de IA
            <span className="text-blue-600"> para tu Negocio</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Accede a expertise profesional especializado las 24 horas. Cada agente está diseñado
            específicamente para resolver problemas de emprendedores y PyMEs latinoamericanas.
          </p>

          {/* Quick stats o badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Disponible 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Especializado LATAM</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Respuestas instantáneas</span>
            </div>
          </div>
        </div>

        {/* Agents Gallery - FIX AQUÍ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {agents.map((agent) => (
            <a
              key={agent.id}
              href={`/chat?agent=${agent.id}`}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{agent.avatar}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {agent.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{agent.description}</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {(agent.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Listo para potenciar tu negocio?
          </h2>
          <p className="text-gray-600 mb-6">
            Selecciona el agente que mejor se adapte a tu necesidad y comienza a consultar ahora mismo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`/chat?agent=${agents[0].id}`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
            🚀 Comenzar ahora
          </a>
        <a
          href="#"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
          📖 Ver más información
        </a>
      </div>
    </div>

  {/* Footer simple */}
  <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
    <div className="flex justify-center space-x-6 text-sm text-gray-500">
      <span>© 2025 InnoTech Solutions</span>
      <span>•</span>
      <span>Especialistas en IA para PyMEs</span>
      <span>•</span>
      <a href="/admin" className="text-gray-400 hover:text-purple-600 text-xs">
        🔧 Admin
      </a>
    </div>
  </footer>
</div>
</div>
)
}