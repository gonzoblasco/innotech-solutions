import { getBrowserId, debugBrowserId, regenerateBrowserId } from './browser-id'

// Función para probar el sistema
export function testBrowserIdSystem() {

  // Test 1: Generar/obtener ID
  const id1 = getBrowserId()

  // Test 2: Verificar persistencia
  const id2 = getBrowserId()

  // Test 3: Debug info
  debugBrowserId()

  // Test 4: Regenerar (opcional)
  // const newId = regenerateBrowserId()
}