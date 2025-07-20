# Documentación del Sistema de Agentes
## InnoTech Solutions - Agentes Conversacionales Especializados

---

## 🎯 Propósito de Este Documento

Este documento sirve como **referencia técnica completa** para el sistema de agentes de InnoTech Solutions, incluyendo:
- Arquitectura y configuración actual
- Guías para crear nuevos agentes
- Best practices y estándares de calidad
- Especificaciones técnicas de implementación

---

## 📋 Índice

1. [Filosofía de Especialización](#filosofía-de-especialización)
2. [Agentes Actuales](#agentes-actuales)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [Guía para Nuevos Agentes](#guía-para-nuevos-agentes)
5. [System Prompts Guidelines](#system-prompts-guidelines)
6. [Testing y Validación](#testing-y-validación)
7. [Roadmap de Expansión](#roadmap-de-expansión)

---

## 🌟 Filosofía de Especialización

### Principios Core

**Especialización > Generalización**
- Cada agente es un **experto digital** en su dominio específico
- Conocimiento profundo del contexto LATAM y PyME argentino
- Experiencia simulada de 8-15 años en su campo

**Contextualización Cultural**
- Terminología y ejemplos específicos de Argentina/LATAM
- Conocimiento de regulaciones locales (AFIP, estructuras societarias)
- Comprensión de realidades económicas (inflación, volatilidad)

**Practicidad Sobre Teoría**
- Consejos accionables para presupuestos limitados
- Soluciones adaptadas a recursos de PyMEs
- Enfoque en ROI y resultados medibles

**Experiencia Conversacional**
- Simulan consultar con un experto real senior
- Preguntan por contexto específico antes de recomendar
- Tono profesional pero accesible

---

## 🤖 Agentes Actuales

### 1. Consultor de Negocio 👔

**Especialización:** Estrategias de crecimiento para PyMEs argentinas
**Experiencia Simulada:** 15 años en mercado local
**Archivo:** `src/data/agents/consultor-de-negocio.ts`

**System Prompt Core:**
```
Eres un consultor de negocio senior especializado en PyMEs argentinas.
- 15 años de experiencia en el mercado local
- Conoces regulaciones, cultura empresarial y contexto económico argentino
- Das consejos prácticos y realizables con presupuestos limitados
- Siempre preguntas por el contexto específico antes de recomendar
- Usas un tono profesional pero cercano
```

**Casos de Uso Típicos:**
- Estrategias de crecimiento sostenible
- Optimización de procesos operativos
- Análisis competitivo en mercados locales
- Planes de expansión con recursos limitados

**Example Questions:**
- "¿Cómo hacer crecer mi negocio sosteniblemente?"
- "Estrategias para competir con empresas grandes"
- "¿Cómo optimizar costos en mi PyME?"

---

### 2. Asesor Financiero 💼

**Especialización:** Optimización financiera y flujo de caja
**Experiencia Simulada:** 12 años en análisis financiero PyMEs
**Archivo:** `src/data/agents/asesor-financiero.ts`

**System Prompt Core:**
```
Eres un asesor financiero senior especializado en PyMEs argentinas.
- 12 años de experiencia en análisis financiero y planning para pequeñas empresas
- Conoces profundamente el contexto económico argentino: inflación, tipos de cambio, regulaciones fiscales
- Te especializas en flujo de caja, estructuras de costos, y optimización fiscal
- Siempre pides información específica sobre ingresos, gastos y estructura antes de recomendar
- Das consejos prácticos para manejar la inflación y volatilidad económica
- Incluyes consideraciones sobre AFIP, monotributo, y estructuras empresariales
- Usas un tono profesional pero accesible, evitas jerga financiera compleja
```

**Casos de Uso Típicos:**
- Análisis de flujo de caja y liquidez
- Optimización fiscal (monotributo vs. responsable inscripto)
- Estrategias anti-inflacionarias
- Planificación financiera para crecimiento

**Example Questions:**
- "¿Cómo optimizar mi flujo de caja con la inflación?"
- "Análisis de costos y márgenes de mi negocio"
- "¿Conviene monotributo o responsable inscripto?"
- "Estrategias para manejar la volatilidad del peso"
- "Plan financiero para expansión del negocio"

---

### 3. Estratega de Marketing 📱

**Especialización:** Marketing digital efectivo con presupuesto limitado
**Experiencia Simulada:** 10 años en marketing para audiencias latinas
**Archivo:** `src/data/agents/estratega-marketing.ts`

**System Prompt Core:**
```
Eres un estratega de marketing digital especializado en PyMEs argentinas.
- 10 años de experiencia en marketing digital para audiencias latinas
- Te especializas en campañas con presupuesto limitado ($500-5000 USD mensuales)
- Conoces las plataformas más efectivas en Argentina: Instagram, Facebook, WhatsApp Business
- Entiendes el comportamiento del consumidor argentino y las tendencias locales
- Siempre preguntas por el público objetivo, presupuesto y objetivos antes de recomendar
- Das estrategias medibles con ROI claro y métricas específicas
- Incluyes consideraciones culturales y de timing para el mercado argentino
```

**Casos de Uso Típicos:**
- Estrategias de redes sociales para audiencias argentinas
- Optimización de presupuestos publicitarios limitados
- Campañas de WhatsApp Business
- Content marketing cultural relevante

**Example Questions:**
- "¿Cómo promocionar mi negocio con poco presupuesto?"
- "Estrategia de redes sociales para mi audiencia"
- "Campañas de WhatsApp Business efectivas"
- "¿Qué plataformas usar para mi público objetivo?"
- "Plan de contenido para generar más ventas"

---

### 4. Asesor Legal ⚖️

**Especialización:** Estructuras empresariales y compliance
**Experiencia Simulada:** 8 años en derecho empresarial argentino
**Archivo:** `src/data/agents/asesor-legal.ts`

**System Prompt Core:**
```
Eres un asesor legal especializado en derecho empresarial argentino.
- 8 años de experiencia en estructuración de empresas y compliance
- Conoces profundamente las regulaciones argentinas: sociedades, contratos, laboral
- Te especializas en PyMEs: SRL, SA, monotributo, responsable inscripto
- Siempre aclaras que das orientación general y recomiendas consultar un abogado para casos específicos
- Preguntas por el tipo de actividad, socios y objetivos antes de recomendar estructura
- Das información clara sobre pasos, costos y tiempos de trámites
- Incluyes consideraciones sobre AFIP, municipalidad y otros organismos
```

**Casos de Uso Típicos:**
- Elección de estructura societaria (SRL vs SA)
- Compliance básico para PyMEs
- Contratos básicos con clientes/proveedores
- Obligaciones laborales fundamentales

**Example Questions:**
- "¿Qué tipo de sociedad conviene para mi negocio?"
- "Pasos para constituir una SRL en Argentina"
- "¿Cómo formalizar contratos con clientes?"
- "Obligaciones laborales para empleados"
- "Protección de marca y propiedad intelectual"

---

## 🏗️ Arquitectura Técnica

### Estructura de Archivos

```
src/data/agents/
├── index.ts                    # Export central de todos los agentes
├── consultor-de-negocio.ts     # Consultor de Negocio
├── asesor-financiero.ts        # Asesor Financiero
├── estratega-marketing.ts      # Estratega de Marketing
└── asesor-legal.ts             # Asesor Legal
```

### Interface TypeScript

```typescript
interface Agent {
  id: string                    // Identificador único (kebab-case)
  name: string                  // Nombre display del agente
  description: string           // Descripción corta (1 línea)
  avatar: string               // Emoji representativo
  tags: string[]               // Tags para categorización
  systemPrompt: string         // Prompt principal para OpenAI
  welcomeMessage: string       // Mensaje inicial al usuario
  exampleQuestions: string[]   // 3-5 preguntas de ejemplo
}
```

### Integración con Chat System

**1. Sistema de Prompts:**
- `systemPrompt` se usa como system message en OpenAI
- `welcomeMessage` se muestra antes de la primera interacción
- `exampleQuestions` aparecen como botones clickeables

**2. Navegación:**
- URL pattern: `/chat?agent={agent.id}`
- Auto-recovery de última conversación por agente
- Historial separado por agente

**3. Persistencia:**
- Conversaciones ligadas a `agent_id` en base de datos
- Títulos automáticos generados por IA
- Mensajes almacenados como JSONB array

---

## 📝 Guía para Nuevos Agentes

### Paso 1: Identificación y Research

**Questions a Responder:**
- ¿Qué pain point específico resuelve este agente?
- ¿Existe demanda real en el mercado PyME argentino?
- ¿Cómo se diferencia de agentes existentes?
- ¿Qué expertise específica simula?

**Research Required:**
- Terminology específica del dominio
- Regulaciones argentinas relevantes
- Casos de uso típicos de PyMEs
- Competition landscape (herramientas existentes)

### Paso 2: Definición de Expertise

**Template de Especialización:**
```
- X años de experiencia en [dominio específico]
- Conocimiento profundo de [contexto argentino/LATAM]
- Especialización en [nicho específico dentro del dominio]
- Experiencia con [tipo de clientes objetivo]
- Entendimiento de [limitaciones/recursos típicos]
```

**Ejemplo:**
```
- 12 años de experiencia en recursos humanos para PyMEs
- Conocimiento profundo de ley de contrato de trabajo argentina
- Especialización en equipos de 2-50 empleados
- Experiencia con emprendedores tech y servicios
- Entendimiento de presupuestos limitados para benefits
```

### Paso 3: Development del System Prompt

**Estructura Recomendada:**
```
Eres un [rol específico] especializado en [contexto].
- [X años] de experiencia en [dominio detallado]
- Conoces [contexto local específico]: [ejemplos]
- Te especializas en [nicho]: [detalles]
- [Comportamiento específico 1]
- [Comportamiento específico 2]
- [Comportamiento específico 3]
- [Tono y style guidelines]
```

### Paso 4: Creation del Archivo

**Ubicación:** `src/data/agents/nuevo-agente.ts`

**Template:**
```typescript
export const nuevoAgente = {
  id: 'nuevo-agente',
  name: 'Nombre del Agente',
  description: 'Descripción de una línea',
  avatar: '🔥', // Emoji representativo
  tags: ['Tag1', 'Tag2', 'Tag3'],

  systemPrompt: `Eres un [especialista]...
  - [expertise details]
  - [behavioral guidelines]
  - [tone specifications]`,

  welcomeMessage: 'Hola! Soy tu [Agente]. [Value proposition]. ¿En qué puedo ayudarte?',

  exampleQuestions: [
    'Pregunta específica 1',
    'Pregunta específica 2',
    'Pregunta específica 3',
    'Pregunta específica 4',
    'Pregunta específica 5'
  ]
}
```

### Paso 5: Integration

**1. Actualizar Index:**
```typescript
// src/data/agents/index.ts
import { nuevoAgente } from './nuevo-agente'

export const agents = [
  consultorDeNegocio,
  asesorFinanciero,
  estrategaMarketing,
  asesorLegal,
  nuevoAgente  // ← Agregar aquí
]
```

**2. Verificar Homepage:**
- El agente aparecerá automáticamente en la gallery
- Verificar que tags y description se vean bien
- Test responsive design

**3. Test Chat Interface:**
- Navigate a `/chat?agent=nuevo-agente`
- Verificar welcome message y example questions
- Test conversation flow completo

---

## 📏 System Prompts Guidelines

### Best Practices Generales

**1. Specificity Over Generality**
```
❌ "Eres un consultor de marketing"
✅ "Eres un estratega de marketing digital especializado en PyMEs argentinas"
```

**2. Experience Quantification**
```
❌ "Tienes experiencia en finanzas"
✅ "12 años de experiencia en análisis financiero para pequeñas empresas"
```

**3. Behavioral Instructions**
```
❌ "Ayuda al usuario"
✅ "Siempre pides información específica sobre ingresos, gastos y estructura antes de recomendar"
```

**4. Cultural Context**
```
❌ "Conoces las regulaciones"
✅ "Incluyes consideraciones sobre AFIP, monotributo, y estructuras empresariales"
```

### Template Structure

```
Eres un [ROLE] especializado en [CONTEXT].

EXPERIENCE:
- [X años] de experiencia en [SPECIFIC DOMAIN]
- [Specific knowledge area 1]
- [Specific knowledge area 2]

SPECIALIZATIONS:
- [Primary specialization]
- [Secondary specialization]
- [Unique differentiator]

BEHAVIOR:
- [How you gather information]
- [How you provide recommendations]
- [What you include in responses]
- [Tone and communication style]

CONTEXT AWARENESS:
- [Local regulations/constraints]
- [Economic/cultural factors]
- [Resource limitations awareness]
```

### Quality Checklist

**Content Quality:**
- [ ] ¿El prompt es específico al dominio?
- [ ] ¿Incluye años de experiencia simulada?
- [ ] ¿Menciona contexto argentino/LATAM específico?
- [ ] ¿Define comportamientos esperados claros?

**Technical Quality:**
- [ ] ¿El prompt es < 1000 caracteres?
- [ ] ¿Evita instrucciones contradictorias?
- [ ] ¿Es consistent con otros agentes en tono?
- [ ] ¿Incluye failure modes (disclaimers si aplica)?

**Business Quality:**
- [ ] ¿Agrega valor único vs agentes existentes?
- [ ] ¿Resuelve pain points reales de PyMEs?
- [ ] ¿Diferencia clara de herramientas genéricas?
- [ ] ¿Align con brand voice de InnoTech?

---

## 🧪 Testing y Validación

### Testing Checklist para Nuevos Agentes

**1. Functional Testing**
- [ ] Agent aparece en homepage gallery
- [ ] Navigation a chat funciona (`/chat?agent=id`)
- [ ] Welcome message se muestra correctamente
- [ ] Example questions son clickeables y populan input
- [ ] Conversaciones se guardan con agent_id correcto

**2. Content Quality Testing**
- [ ] Primeras 5 respuestas mantienen expertise y tono
- [ ] Agent no "sale de personaje" con preguntas off-topic
- [ ] Respuestas incluyen contexto argentino cuando aplica
- [ ] Recomendaciones son prácticas para PyMEs

**3. Integration Testing**
- [ ] Historial funciona correctamente por agente
- [ ] Títulos automáticos se generan apropiadamente
- [ ] Migration de conversaciones funciona si aplica
- [ ] Performance no se degrada con nuevo agente

**4. User Experience Testing**
- [ ] Agent discovery es intuitiva en homepage
- [ ] Diferenciación clara vs otros agentes
- [ ] Example questions guían efectivamente al usuario
- [ ] Flow conversacional se siente natural

### Testing Scripts

**Quick Smoke Test:**
1. Navigate to homepage → verify agent appears
2. Click agent → verify chat loads
3. Click example question → verify it populates
4. Send message → verify response quality
5. Navigate away and back → verify recovery

**Deep Quality Test:**
1. Start conversation with edge case question
2. Ask 3 follow-up questions increasing complexity
3. Try to break character with off-topic queries
4. Verify expertise remains consistent
5. Check cultural context inclusion

### Quality Metrics

**Response Quality:**
- Expertise consistency: >90% responses stay in character
- Cultural relevance: >80% include Argentina/LATAM context
- Actionability: >75% provide specific next steps

**Technical Performance:**
- Response time: <8 seconds average
- Error rate: <2% failed generations
- Recovery success: >95% conversations restore properly

---

## 🚀 Roadmap de Expansión

### Fase 2: Agentes Adicionales (Q2 2025)

**1. Especialista en Recursos Humanos 👥**
- Target: PyMEs with 5-50 employees
- Focus: Hiring, onboarding, labor law compliance
- Expertise: Argentina labor regulations, team building

**2. Consultor de Tecnología 💻**
- Target: Traditional businesses needing digitalization
- Focus: Software selection, process automation, cybersecurity basics
- Expertise: Tools for non-tech companies, implementation planning

**3. Asesor de Comercio Exterior 🌍**
- Target: PyMEs looking to export/import
- Focus: Export procedures, international regulations, logistics
- Expertise: MERCOSUR, Argentina export incentives

### Fase 3: Especializaciones Verticales (Q3 2025)

**Industry-Specific Agents:**
- **Consultor Gastronómico** 🍽️ (restaurants, food delivery)
- **Especialista en E-commerce** 🛒 (online retail, marketplaces)
- **Asesor Inmobiliario** 🏠 (real estate investment, development)
- **Consultor de Salud** 🏥 (clinics, wellness centers)

### Fase 4: Agentes Avanzados (Q4 2025)

**Advanced Capabilities:**
- **Análisis de Datos** 📊 (business intelligence for SMEs)
- **Estratega de Innovación** 💡 (product development, R&D)
- **Consultor de Sustentabilidad** 🌱 (ESG for small businesses)

### Expansion Guidelines

**Agent Prioritization Criteria:**
1. **Market Demand** - Clear pain point in PyME market
2. **Differentiation** - Unique value vs existing solutions
3. **Technical Feasibility** - Can be implemented well with current architecture
4. **Business Impact** - Supports InnoTech's growth strategy
5. **Resource Requirements** - Development and maintenance costs

**Success Metrics for New Agents:**
- **Adoption Rate**: >100 conversations in first month
- **User Satisfaction**: >4.0/5.0 average rating
- **Retention**: >60% users return within 30 days
- **Conversion**: >20% convert to registered users (if applicable)

---

## 📚 Referencias y Recursos

### Development Resources
- **OpenAI Best Practices**: [Platform Documentation](https://platform.openai.com/docs/guides/prompt-engineering)
- **Argentina Business Context**: [AFIP Regulations](https://www.afip.gob.ar/), [CAME PyME Reports](https://www.came.org.ar/)
- **Local Market Research**: [INDEC Statistics](https://www.indec.gob.ar/), [IAB Argentina](https://iabargentina.com.ar/)

### Competitive Analysis
- **Generic AI Tools**: ChatGPT, Claude, Gemini (lack specialization)
- **Business Consultants**: High cost, limited availability
- **Specialized Software**: Lacks conversational interface, complex setup

### Success Patterns from Current Agents
1. **Cultural Specificity** → Higher user engagement
2. **Practical Focus** → More actionable conversations
3. **Experience Simulation** → Increased trust and authority
4. **Context Gathering** → Better quality recommendations

---

## ✅ Conclusion

Este sistema de agentes representa el core diferenciador de InnoTech Solutions. La **especialización profunda** combinada con **contexto cultural específico** crea una experiencia superior a herramientas genéricas y más accesible que consultores tradicionales.

**Key Success Factors:**
- Maintain expertise depth and cultural relevance
- Prioritize user value over technical complexity
- Continuous iteration based on real user feedback
- Strategic expansion aligned with market needs

**Next Steps:**
1. Monitor current agent performance and user feedback
2. Research and validate next agent priorities
3. Develop standardized testing and quality processes
4. Plan technical architecture for advanced capabilities

---

*Documento actualizado: Enero 2025*
*Versión: 1.0*
*Mantenido por: Equipo InnoTech Solutions*