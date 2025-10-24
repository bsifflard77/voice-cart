import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import storesRoutes from './routes/stores.js'
import departmentsRoutes from './routes/departments.js'
import itemsRoutes from './routes/items.js'
import pool from './config/database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
app.use('/api/items', itemsRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'VoiceCart API',
    version: '1.0.0',
    endpoints: {
      stores: '/api/stores',
      departments: '/api/departments',
      items: '/api/items',
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

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     VoiceCart API Server Running      ║
╠═══════════════════════════════════════╣
║  Port: ${PORT}
║  Environment: ${process.env.NODE_ENV || 'development'}
║  Database: ${process.env.DB_NAME || 'voicecart'}
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
