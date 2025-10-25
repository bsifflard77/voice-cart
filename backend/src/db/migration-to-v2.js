/**
 * Migration script to upgrade database from V1 to V2
 * Adds user authentication and shopping lists support
 *
 * Run this script to migrate existing data
 */

import pool from '../config/database.js'
import dotenv from 'dotenv'

dotenv.config()

async function migrate() {
  const client = await pool.connect()

  try {
    console.log('Starting migration to V2...\n')

    await client.query('BEGIN')

    // Step 1: Create users table
    console.log('1. Creating users table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `)
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)')
    console.log('✓ Users table created\n')

    // Step 2: Create shopping_lists table
    console.log('2. Creating shopping_lists table...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS shopping_lists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        notes TEXT
      )
    `)
    await client.query('CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON shopping_lists(user_id)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_shopping_lists_status ON shopping_lists(status)')
    console.log('✓ Shopping lists table created\n')

    // Step 3: Check if items table needs migration
    const checkColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'items' AND column_name = 'shopping_list_id'
    `)

    if (checkColumn.rows.length === 0) {
      console.log('3. Migrating items table...')

      // Rename old items table
      await client.query('ALTER TABLE items RENAME TO items_old')

      // Create new items table with shopping_list_id
      await client.query(`
        CREATE TABLE items (
          id SERIAL PRIMARY KEY,
          shopping_list_id INTEGER NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
          department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
          name VARCHAR(255) NOT NULL,
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'picked_up', 'deleted')),
          added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          picked_up_at TIMESTAMP,
          notes TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `)

      await client.query('CREATE INDEX IF NOT EXISTS idx_items_list_status ON items(shopping_list_id, status)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_items_department_v2 ON items(department_id)')
      await client.query('CREATE INDEX IF NOT EXISTS idx_items_picked_up_at_v2 ON items(picked_up_at)')

      console.log('✓ Items table migrated\n')
      console.log('⚠ Old items are in items_old table. You can migrate them manually or drop the table.\n')
    } else {
      console.log('3. Items table already has shopping_list_id column\n')
    }

    // Step 4: Create/update triggers
    console.log('4. Creating triggers...')
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `)

    await client.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users')
    await client.query('DROP TRIGGER IF EXISTS update_shopping_lists_updated_at ON shopping_lists')
    await client.query('DROP TRIGGER IF EXISTS update_items_updated_at ON items')

    await client.query(`
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `)

    await client.query(`
      CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `)

    await client.query(`
      CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    `)

    console.log('✓ Triggers created\n')

    await client.query('COMMIT')

    console.log('✅ Migration completed successfully!\n')
    console.log('Next steps:')
    console.log('1. Restart your backend server')
    console.log('2. Register a new user via /api/auth/register')
    console.log('3. Create shopping lists for your users')
    console.log('4. If you had old items, migrate them manually from items_old table')
    console.log('\nTo drop old items table: DROP TABLE items_old CASCADE;')

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run migration
migrate().catch(console.error)
