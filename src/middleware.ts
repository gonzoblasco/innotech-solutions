import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Solo proteger rutas de chat
  if (req.nextUrl.pathname.startsWith('/chat')) {
    try {
      const supabase = createMiddlewareClient({ req, res })

      // Intentar obtener la sesión con manejo de errores
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      // Si hay error de token o no hay sesión, redirect a login
      if (error || !session) {
        console.log('Middleware auth error:', error?.message || 'No session')

        const redirectUrl = new URL('/login', req.url)
        redirectUrl.searchParams.set('returnTo', req.nextUrl.pathname + req.nextUrl.search)
        return NextResponse.redirect(redirectUrl)
      }

      // Si hay sesión válida, continuar
      return res

    } catch (error) {
      console.error('Middleware catch error:', error)

      // En caso de error, redirect a login
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('returnTo', req.nextUrl.pathname + req.nextUrl.search)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/chat/:path*']
}