import { getBrowserId, debugBrowserId, regenerateBrowserId } from './browser-id'

// Función para probar el sistema
export function testBrowserIdSystem() {
  console.log('🧪 Testing Browser ID System...')

  // Test 1: Generar/obtener ID
  const id1 = getBrowserId()
  console.log('Test 1 - ID generado:', id1)

  // Test 2: Verificar persistencia
  const id2 = getBrowserId()
  console.log('Test 2 - Mismo ID:', id1 === id2)

  // Test 3: Debug info
  debugBrowserId()

  // Test 4: Regenerar (opcional)
  // const newId = regenerateBrowserId()
  // console.log('Test 4 - Nuevo ID:', newId)
}