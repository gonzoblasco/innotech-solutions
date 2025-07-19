import Link from 'next/link'
import { consultorDeNegocio } from '@/data/agents/consultor-de-negocio'
import { asesorFinanciero } from '@/data/agents/asesor-financiero'
import { estrategaMarketing } from '@/data/agents/estratega-marketing'
import { asesorLegal } from '@/data/agents/asesor-legal'

// AHORA TENEMOS 4 AGENTES REALES
const agents = [consultorDeNegocio, asesorFinanciero, estrategaMarketing, asesorLegal]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">InnoTech Solutions</h1>
          <p className="text-gray-600 mt-2">Consultores Digitales Especializados para PyMEs</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Accede a Consultores Expertos Digitales, 24/7
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sin complejidad técnica. Solo resultados profesionales.
            Cada agente está especializado en resolver problemas específicos de PyMEs argentinas.
          </p>
        </div>

        {/* Agents Grid - AHORA CON 4 AGENTES REALES */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12">¿Por qué InnoTech Solutions?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎯"
              title="Especialización Real"
              description="Cada agente conoce profundamente el mercado argentino y las necesidades de PyMEs"
            />
            <FeatureCard
              icon="⚡"
              title="Respuestas Inmediatas"
              description="Disponible 24/7, sin esperas ni citas. Obtén insights profesionales al instante"
            />
            <FeatureCard
              icon="💰"
              title="Costo Accesible"
              description="Una fracción del costo de contratar consultores tradicionales"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

// Componente para agente activo - ACTUALIZADO
function AgentCard({ agent }: { agent: typeof consultorDeNegocio }) {
  return (
    <Link href={`/chat?agent=${agent.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 hover:border-blue-300">
        <div className="text-4xl mb-4">{agent.avatar}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{agent.name}</h3>
        <p className="text-gray-600 mb-4">{agent.description}</p>
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-600">Preguntas ejemplo:</p>
          {agent.exampleQuestions.slice(0, 2).map((question, index) => (
            <p key={index} className="text-sm text-gray-500">• {question}</p>
          ))}
        </div>
        <div className="mt-4 inline-flex items-center text-blue-600 font-medium">
          Comenzar conversación →
        </div>
      </div>
    </Link>
  )
}

// ELIMINAR PlaceholderCard - ya no lo necesitamos

// Componente para features
function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}