/**
 * Browser ID System - Identificación única por navegador
 * Se usa hasta implementar autenticación completa
 */

const BROWSER_ID_KEY = 'innotech_browser_id'

export function getBrowserId(): string {
  // Solo funciona en el cliente
  if (typeof window === 'undefined') {
    return ''
  }

  // Intentar obtener ID existente
  let browserId = localStorage.getItem(BROWSER_ID_KEY)

  // Si no existe, crear uno nuevo
  if (!browserId) {
    browserId = crypto.randomUUID()
    localStorage.setItem(BROWSER_ID_KEY, browserId)
    console.log('🆔 Nuevo Browser ID generado:', browserId)
  }

  return browserId
}

// Función para regenerar ID (útil para testing)
export function regenerateBrowserId(): string {
  const newId = crypto.randomUUID()
  localStorage.setItem(BROWSER_ID_KEY, newId)
  console.log('🔄 Browser ID regenerado:', newId)
  return newId
}

// Función para verificar si el browser ya tiene ID
export function hasBrowserId(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(BROWSER_ID_KEY) !== null
}

// Debug: Mostrar ID actual
export function debugBrowserId(): void {
  console.log('🔍 Browser ID actual:', getBrowserId())
}