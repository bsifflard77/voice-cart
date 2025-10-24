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
    if (error.code === '23503') {
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
