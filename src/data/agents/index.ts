import { consultorDeNegocio } from './consultor-de-negocio'
import { asesorFinanciero } from './asesor-financiero'
import { estrategaMarketing } from './estratega-marketing'
import { asesorLegal } from './asesor-legal'

export const agents = [
  consultorDeNegocio,
  asesorFinanciero,
  estrategaMarketing,
  asesorLegal
]

export type Agent = typeof agents[0]