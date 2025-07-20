# InnoTech Solutions
## Agentes de IA Especializados para Profesionales LATAM

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4)](https://tailwindcss.com/)

**Democratizando el acceso a expertise profesional mediante inteligencia artificial especializada.**
**Proyecto en crecimiento activo.** Nos enfocamos en que cualquiera pueda aprovechar la IA sin conocimientos técnicos. Cada semana agregamos nuevas funciones y agentes impulsados por la comunidad.


---

## 🎯 Descripción

InnoTech Solutions es una plataforma de agentes conversacionales de IA especializados en el mercado latinoamericano. Cada agente actúa como un consultor experto digital, proporcionando asesoramiento profesional especializado las 24 horas, los 7 días de la semana.

### Agentes Disponibles

- **👔 Consultor de Negocio**: Estrategias de crecimiento para PyMEs argentinas
- **💼 Asesor Financiero**: Optimización financiera y flujo de caja
- **📱 Estratega de Marketing**: Marketing digital efectivo con presupuesto limitado
- **⚖️ Asesor Legal**: Estructuras empresariales y compliance

---

## 🚀 Características Principales

### ✨ Experiencia de Usuario
- **Conversaciones naturales** sin necesidad de prompt engineering
- **Especialización LATAM** con contexto cultural y regulatorio local
- **Persistencia completa** de conversaciones entre sesiones
- **Acceso multiplataforma** desde cualquier dispositivo

### 🔐 Sistema de Usuarios
- **Autenticación segura** con Supabase Auth
- **Row Level Security (RLS)** para aislamiento de datos
- **Migración automática** de conversaciones anónimas
- **Dashboard personalizado** con historial completo

### 🤖 Tecnología IA
- **OpenAI GPT-4o-mini** para respuestas de alta calidad
- **Títulos inteligentes** generados automáticamente
- **Memoria conversacional** contextual
- **Respuestas especializadas** por dominio de expertise

### 🛡️ Seguridad y Privacidad
- **Políticas RLS** a nivel de base de datos
- **Tokens JWT** para autenticación
- **Aislamiento completo** entre usuarios
- **Cumplimiento WCAG** para accesibilidad

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15** con App Router
- **TypeScript** strict mode
- **Tailwind CSS** para styling responsive
- **React 18** con hooks modernos

### Backend
- **Next.js API Routes** integrado
- **Supabase PostgreSQL** como base de datos
- **Supabase Auth** para autenticación
- **OpenAI API** para IA conversacional

### Infraestructura
- **Supabase** para backend completo
- **Vercel** ready para deployment
- **Environment variables** para configuración

---

## 📦 Instalación y Setup

### Prerrequisitos

- Node.js 18+
- npm/yarn/pnpm
- Cuenta de Supabase
- API Key de OpenAI

### 1. Clonar e Instalar

```bash
git clone [repository-url]
cd innotech-solutions
npm install
```

### 2. Variables de Entorno

Crear `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-key

# OpenAI Configuration  
OPENAI_API_KEY=your-openai-api-key
```

### 3. Setup de Base de Datos

Ejecutar en Supabase SQL Editor:

```sql
-- Crear tabla de conversaciones
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  browser_id TEXT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id TEXT NOT NULL,
  title TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS (ver /docs/rls-policies.sql para políticas completas)
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── chat/page.tsx      # Chat interface
│   ├── login/page.tsx     # Autenticación
│   ├── admin/page.tsx     # Panel administrativo
│   └── api/               # API Routes
│       ├── chat/          # OpenAI integration
│       ├── conversations/ # CRUD conversaciones
│       └── admin/         # APIs administrativas
├── components/            # Componentes React
│   ├── auth/             # Autenticación
│   └── chat/             # Interface de chat
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Estado de autenticación
├── hooks/                # Custom hooks
│   └── useConversations.ts # Gestión conversaciones
├── lib/                  # Utilities
│   ├── supabase.ts       # Cliente Supabase
│   └── browser-id.ts     # Identificación browser
└── data/                 # Configuración
    └── agents/           # Definición de agentes
```

---

## 🎭 Agentes Especializados

### Configuración de Agentes

Cada agente se define en `src/data/agents/` con:

```typescript
export const consultorDeNegocio = {
  id: 'consultor-de-negocio',
  name: 'Consultor de Negocio',
  description: 'Especialista en estrategias de crecimiento...',
  avatar: '👔',
  tags: ['Estrategia', 'Crecimiento', 'PyME'],
  systemPrompt: `Eres un consultor senior...`,
  exampleQuestions: [...]
}
```

### Agregar Nuevos Agentes

1. Crear archivo en `src/data/agents/nuevo-agente.ts`
2. Exportar en `src/data/agents/index.ts`
3. Definir system prompt especializado
4. Agregar preguntas de ejemplo

---

## 🔐 Sistema de Autenticación

### Flow de Usuario

1. **Usuario Anónimo**: Conversaciones se guardan con `browser_id`
2. **Registro/Login**: Migración automática de conversaciones
3. **Usuario Autenticado**: Conversaciones sincronizadas con `user_id`

### Row Level Security

Políticas implementadas garantizan:
- Usuarios solo ven sus propias conversaciones
- Aislamiento completo entre cuentas
- Protección a nivel de base de datos

---

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# 1. Build local
npm run build

# 2. Deploy to Vercel
npx vercel --prod

# 3. Configurar environment variables en Vercel dashboard
```

### Variables de Entorno Producción

Configurar en Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

---

## 🧪 Testing

### Test de Aislamiento RLS

```bash
# 1. Crear dos usuarios diferentes
# 2. Cada usuario crea conversaciones
# 3. Verificar que no ven conversaciones del otro
```

### Test de Migración

```bash
# 1. Usuario anónimo crea conversaciones
# 2. Registro/login
# 3. Verificar migración automática
```

---

## 🎨 Personalización

### Modificar Agentes

Editar archivos en `src/data/agents/` para:
- Cambiar personalidad del agente
- Actualizar preguntas de ejemplo
- Modificar avatar y descripción

### Styling

- **Tailwind CSS** para componentes
- **CSS Variables** en `globals.css`
- **Responsive design** mobile-first

### Branding

Actualizar en:
- `src/app/page.tsx` - Homepage
- `src/lib/config.ts` - Configuración site
- `public/` - Assets y favicons

---

## 📊 Analytics y Monitoring

### Admin Dashboard

Acceso en `/admin` con password `admin123`:
- Estadísticas de conversaciones
- Gestión de usuarios
- Limpieza de base de datos

### Métricas Disponibles

- Total conversaciones por usuario
- Agentes más utilizados
- Retención de usuarios
- Performance de respuestas

## 🛣️ Roadmap

- Integrar nuevos agentes para más industrias.
- Mejorar la personalización de cada conversación.
- Abrir un programa de feedback constante con la comunidad.

---

## 🤝 Contribución

### Development Workflow

1. **Fork** del repositorio
2. **Crear branch** para feature: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a branch: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### Coding Standards

- **TypeScript strict** mode habilitado
- **ESLint** para linting
- **Prettier** para formatting
- **Conventional Commits** para mensajes

---

## 🐛 Troubleshooting

### Problemas Comunes

**Error de autenticación**
```bash
# Verificar variables de entorno
npm run dev
# Revisar Supabase dashboard > Authentication
```

**Conversaciones no se guardan**
```bash
# Verificar políticas RLS
# Ejecutar: SELECT * FROM pg_policies WHERE tablename = 'conversations';
```

**API OpenAI falla**
```bash
# Verificar API key en .env.local
# Revisar limits en OpenAI dashboard
```

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

## 👤 Autor

**Gonzalo Blasco**
- Emprendedor en IA aplicada
- Buenos Aires, Argentina
- [LinkedIn](your-linkedin) | [GitHub](your-github)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework excepcional
- [Supabase](https://supabase.com/) por el backend completo
- [OpenAI](https://openai.com/) por las capacidades de IA
- [Tailwind CSS](https://tailwindcss.com/) por el sistema de diseño

---

**InnoTech Solutions - Democratizando el acceso a expertise profesional** 🚀