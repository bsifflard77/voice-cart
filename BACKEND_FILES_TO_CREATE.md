# VoiceCart Backend Files - Instructions for Claude Code

Please create the following 7 files in the VoiceCart backend project:

---

## File 1: backend/src/controllers/storesController.js

```javascript
import pool from '../config/database.js'

// Get all stores
export async function getAllStores(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM stores ORDER BY name ASC'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching stores:', error)
    res.status(500).json({ error: 'Failed to fetch stores' })
  }
}

// Get single store by ID
export async function getStoreById(req, res) {
  try {
    const { id } = req.params
    const result = await pool.query(
      'SELECT * FROM stores WHERE id = $1',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching store:', error)
    res.status(500).json({ error: 'Failed to fetch store' })
  }
}

// Create new store
export async function createStore(req, res) {
  try {
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Store name is required' })
    }

    const result = await pool.query(
      'INSERT INTO stores (name) VALUES ($1) RETURNING *',
      [name.trim()]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Store already exists' })
    }
    console.error('Error creating store:', error)
    res.status(500).json({ error: 'Failed to create store' })
  }
}

// Update store
export async function updateStore(req, res) {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Store name is required' })
    }

    const result = await pool.query(
      'UPDATE stores SET name = $1 WHERE id = $2 RETURNING *',
      [name.trim(), id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Store name already exists' })
    }
    console.error('Error updating store:', error)
    res.status(500).json({ error: 'Failed to update store' })
  }
}

// Delete store
export async function deleteStore(req, res) {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM stores WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' })
    }

    res.json({ message: 'Store deleted successfully', store: result.rows[0] })
  } catch (error) {
    console.error('Error deleting store:', error)
    res.status(500).json({ error: 'Failed to delete store' })
  }
}

export default {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
}
```

---

## File 2: backend/src/controllers/departmentsController.js

```javascript
import pool from '../config/database.js'

// Get all departments for a store
export async function getDepartmentsByStore(req, res) {
  try {
    const { storeId } = req.params

    const result = await pool.query(
      `SELECT d.*, s.name as store_name
       FROM departments d
       JOIN stores s ON d.store_id = s.id
       WHERE d.store_id = $1
       ORDER BY d.display_order ASC, d.name ASC`,
      [storeId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching departments:', error)
    res.status(500).json({ error: 'Failed to fetch departments' })
  }
}

// Get single department by ID
export async function getDepartmentById(req, res) {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT d.*, s.name as store_name
       FROM departments d
       JOIN stores s ON d.store_id = s.id
       WHERE d.id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching department:', error)
    res.status(500).json({ error: 'Failed to fetch department' })
  }
}

// Create new department
export async function createDepartment(req, res) {
  try {
    const { storeId, name, displayOrder } = req.body

    if (!storeId || !name || name.trim() === '') {
      return res.status(400).json({
        error: 'Store ID and department name are required'
      })
    }

    const result = await pool.query(
      `INSERT INTO departments (store_id, name, display_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [storeId, name.trim(), displayOrder || 0]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({
        error: 'Department already exists for this store'
      })
    }
    if (error.code === '23503') { // Foreign key violation
      return res.status(404).json({ error: 'Store not found' })
    }
    console.error('Error creating department:', error)
    res.status(500).json({ error: 'Failed to create department' })
  }
}

// Update department
export async function updateDepartment(req, res) {
  try {
    const { id } = req.params
    const { name, displayOrder } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Department name is required' })
    }

    const result = await pool.query(
      `UPDATE departments
       SET name = $1, display_order = $2
       WHERE id = $3
       RETURNING *`,
      [name.trim(), displayOrder || 0, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Department name already exists for this store'
      })
    }
    console.error('Error updating department:', error)
    res.status(500).json({ error: 'Failed to update department' })
  }
}

// Delete department
export async function deleteDepartment(req, res) {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM departments WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Department not found' })
    }

    res.json({
      message: 'Department deleted successfully',
      department: result.rows[0]
    })
  } catch (error) {
    console.error('Error deleting department:', error)
    res.status(500).json({ error: 'Failed to delete department' })
  }
}

export default {
  getDepartmentsByStore,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
}
```

---

## File 3: backend/src/controllers/itemsController.js

```javascript
import pool from '../config/database.js'
import { categorizeItem } from '../services/openai.js'

// Get all active items for a store (grouped by department)
export async function getActiveItemsByStore(req, res) {
  try {
    const { storeId } = req.params

    const result = await pool.query(
      `SELECT
        i.*,
        d.name as department_name,
        d.display_order as department_order,
        s.name as store_name
       FROM items i
       LEFT JOIN departments d ON i.department_id = d.id
       JOIN stores s ON i.store_id = s.id
       WHERE i.store_id = $1 AND i.status = 'active'
       ORDER BY d.display_order ASC, d.name ASC, i.added_at DESC`,
      [storeId]
    )

    // Group items by department
    const groupedItems = result.rows.reduce((acc, item) => {
      const deptName = item.department_name || 'Uncategorized'
      if (!acc[deptName]) {
        acc[deptName] = []
      }
      acc[deptName].push(item)
      return acc
    }, {})

    res.json({
      store_id: parseInt(storeId),
      store_name: result.rows[0]?.store_name || null,
      items_by_department: groupedItems,
      total_items: result.rows.length
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
}

// Get purchase history for a store
export async function getPurchaseHistory(req, res) {
  try {
    const { storeId } = req.params
    const { limit = 50, offset = 0 } = req.query

    const result = await pool.query(
      `SELECT
        i.*,
        d.name as department_name,
        s.name as store_name
       FROM items i
       LEFT JOIN departments d ON i.department_id = d.id
       JOIN stores s ON i.store_id = s.id
       WHERE i.store_id = $1 AND i.status = 'picked_up'
       ORDER BY i.picked_up_at DESC
       LIMIT $2 OFFSET $3`,
      [storeId, limit, offset]
    )

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) as total
       FROM items
       WHERE store_id = $1 AND status = 'picked_up'`,
      [storeId]
    )

    res.json({
      items: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error) {
    console.error('Error fetching purchase history:', error)
    res.status(500).json({ error: 'Failed to fetch purchase history' })
  }
}

// Create new item with AI categorization
export async function createItem(req, res) {
  try {
    const { storeId, name, notes } = req.body

    if (!storeId || !name || name.trim() === '') {
      return res.status(400).json({
        error: 'Store ID and item name are required'
      })
    }

    // Get departments for this store
    const deptResult = await pool.query(
      'SELECT id, name FROM departments WHERE store_id = $1',
      [storeId]
    )

    if (deptResult.rows.length === 0) {
      return res.status(400).json({
        error: 'No departments found for this store. Please add departments first.'
      })
    }

    // Use AI to categorize the item
    const departmentNames = deptResult.rows.map(d => d.name)
    const suggestedDepartmentName = await categorizeItem(name.trim(), departmentNames)

    // Find department ID
    const department = deptResult.rows.find(
      d => d.name.toLowerCase() === suggestedDepartmentName.toLowerCase()
    )
    const departmentId = department?.id || deptResult.rows[0].id

    // Insert item
    const result = await pool.query(
      `INSERT INTO items (store_id, department_id, name, notes, status, added_at)
       VALUES ($1, $2, $3, $4, 'active', CURRENT_TIMESTAMP)
       RETURNING *`,
      [storeId, departmentId, name.trim(), notes || null]
    )

    // Get full item with department info
    const fullItem = await pool.query(
      `SELECT i.*, d.name as department_name, s.name as store_name
       FROM items i
       LEFT JOIN departments d ON i.department_id = d.id
       JOIN stores s ON i.store_id = s.id
       WHERE i.id = $1`,
      [result.rows[0].id]
    )

    res.status(201).json({
      ...fullItem.rows[0],
      ai_suggested_department: suggestedDepartmentName
    })
  } catch (error) {
    if (error.code === '23503') { // Foreign key violation
      return res.status(404).json({ error: 'Store not found' })
    }
    console.error('Error creating item:', error)
    res.status(500).json({ error: 'Failed to create item' })
  }
}

// Update item (change department, notes, etc.)
export async function updateItem(req, res) {
  try {
    const { id } = req.params
    const { name, departmentId, notes } = req.body

    const updates = []
    const values = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`)
      values.push(name.trim())
    }
    if (departmentId !== undefined) {
      updates.push(`department_id = $${paramCount++}`)
      values.push(departmentId)
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`)
      values.push(notes)
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    values.push(id)

    const result = await pool.query(
      `UPDATE items SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({ error: 'Failed to update item' })
  }
}

// Mark item as picked up
export async function markItemPickedUp(req, res) {
  try {
    const { id } = req.params

    const result = await pool.query(
      `UPDATE items
       SET status = 'picked_up', picked_up_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'active'
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Item not found or already picked up'
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error marking item as picked up:', error)
    res.status(500).json({ error: 'Failed to mark item as picked up' })
  }
}

// Delete item (soft delete - set status to 'deleted')
export async function deleteItem(req, res) {
  try {
    const { id } = req.params
    const { permanent = false } = req.query

    if (permanent === 'true') {
      // Hard delete
      const result = await pool.query(
        'DELETE FROM items WHERE id = $1 RETURNING *',
        [id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' })
      }

      return res.json({
        message: 'Item permanently deleted',
        item: result.rows[0]
      })
    } else {
      // Soft delete
      const result = await pool.query(
        `UPDATE items SET status = 'deleted' WHERE id = $1 RETURNING *`,
        [id]
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Item not found' })
      }

      res.json({ message: 'Item deleted', item: result.rows[0] })
    }
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({ error: 'Failed to delete item' })
  }
}

export default {
  getActiveItemsByStore,
  getPurchaseHistory,
  createItem,
  updateItem,
  markItemPickedUp,
  deleteItem,
}
```

---

## File 4: backend/src/routes/stores.js

```javascript
import express from 'express'
import {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} from '../controllers/storesController.js'

const router = express.Router()

router.get('/', getAllStores)
router.get('/:id', getStoreById)
router.post('/', createStore)
router.put('/:id', updateStore)
router.delete('/:id', deleteStore)

export default router
```

---

## File 5: backend/src/routes/departments.js

```javascript
import express from 'express'
import {
  getDepartmentsByStore,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentsController.js'

const router = express.Router()

router.get('/store/:storeId', getDepartmentsByStore)
router.get('/:id', getDepartmentById)
router.post('/', createDepartment)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

export default router
```

---

## File 6: backend/src/routes/items.js

```javascript
import express from 'express'
import {
  getActiveItemsByStore,
  getPurchaseHistory,
  createItem,
  updateItem,
  markItemPickedUp,
  deleteItem,
} from '../controllers/itemsController.js'

const router = express.Router()

router.get('/store/:storeId', getActiveItemsByStore)
router.get('/store/:storeId/history', getPurchaseHistory)
router.post('/', createItem)
router.put('/:id', updateItem)
router.patch('/:id/pickup', markItemPickedUp)
router.delete('/:id', deleteItem)

export default router
```

---

## File 7: backend/src/server.js

```javascript
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
```

---

# Instructions Summary

Please create all 7 files above with their exact content in the VoiceCart backend project at the specified paths.
