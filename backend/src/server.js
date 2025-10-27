import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import storesRoutes from './routes/stores.js'
import departmentsRoutes from './routes/departments.js'
import itemsRoutes from './routes/items.js'
import authRoutes from './routes/auth.js'
import shoppingListsRoutes from './routes/shoppingLists.js'
import itemsV2Routes from './routes/itemsV2.js'
import pool from './config/database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.40.214:3000',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    })
  }
})

// API Routes
app.use('/api/stores', storesRoutes)
app.use('/api/departments', departmentsRoutes)
app.use('/api/items', itemsRoutes) // V1 - Legacy

// V2 Routes - Authentication and Shopping Lists
app.use('/api/auth', authRoutes)
app.use('/api/shopping-lists', shoppingListsRoutes)
app.use('/api/v2/items', itemsV2Routes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'VoiceCartz API',
    version: '2.0.0',
    endpoints: {
      // V2 - Authentication & Shopping Lists
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        profile: '/api/auth/me'
      },
      shoppingLists: '/api/shopping-lists',
      items: '/api/v2/items',
      // V1 - Legacy (for backward compatibility)
      legacy: {
        stores: '/api/stores',
        departments: '/api/departments',
        items: '/api/items'
      },
      health: '/health'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  })
})

// Start server - Listen on all network interfaces for mobile access
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════╗
║     VoiceCartz API Server Running      ║
╠═══════════════════════════════════════╣
║  Port: ${PORT}
║  Host: 0.0.0.0 (all interfaces)
║  Local: http://localhost:${PORT}
║  Network: http://192.168.40.214:${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Database: ${process.env.DB_NAME || 'voicecartz'}
╚═══════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  await pool.end()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  await pool.end()
  process.exit(0)
})

export default app
