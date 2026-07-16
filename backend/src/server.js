import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import app from './app.js'
import { testConnection } from './config/db.js'

dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
})

const PORT = Number(process.env.PORT || 4000)

const boot = async () => {
  try {
    await testConnection()
    console.log('✅ MySQL conectado')
  } catch (error) {
    console.error('❌ No se pudo conectar a MySQL:', error.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`🚀 Backend listo en http://localhost:${PORT}`)
  })
}

boot()
