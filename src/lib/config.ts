export const siteConfig = {
  name: 'InnoTech Solutions',
  description: 'Consultores Digitales Especializados para PyMEs',
  url: 'https://innotech-solutions.net'
}

export const agents = [
  'consultor-de-negocio',
  'asesor-financiero',
  'estratega-marketing',
  'asesor-legal'
] as const

export type AgentId = typeof agents[number]