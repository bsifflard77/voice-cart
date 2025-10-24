import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function setupDatabase() {
  try {
    console.log('Setting up database...')

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
    process.exit(1)
  }
}

setupDatabase()