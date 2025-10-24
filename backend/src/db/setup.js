import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'
import dotenv from 'dotenv'
import pool from '../config/database.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupDatabase() {
  let adminClient
  try {
    console.log('Setting up database...')

    // First, connect to postgres database to create voicecart database if it doesn't exist
    adminClient = new pg.Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: 'postgres', // Connect to default postgres database
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD
    })

    await adminClient.connect()
    console.log('✓ Connected to PostgreSQL')

    // Check if database exists
    const dbCheck = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME || 'voicecart']
    )

    if (dbCheck.rows.length === 0) {
      // Create database
      await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME || 'voicecart'}`)
      console.log(`✓ Database '${process.env.DB_NAME || 'voicecart'}' created`)
    } else {
      console.log(`✓ Database '${process.env.DB_NAME || 'voicecart'}' already exists`)
    }

    await adminClient.end()

    // Now connect to the voicecart database and create tables
    console.log('Creating tables...')

    // Read schema file
    const schemaPath = path.join(__dirname, '../../database-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Execute schema
    await pool.query(schema)

    console.log('✓ Database setup complete!')
    console.log('✓ Tables created: stores, departments, items')
    console.log('✓ Seed data inserted')

    process.exit(0)
  } catch (error) {
    console.error('Error setting up database:', error)
    if (adminClient) {
      await adminClient.end()
    }
    process.exit(1)
  }
}

setupDatabase()