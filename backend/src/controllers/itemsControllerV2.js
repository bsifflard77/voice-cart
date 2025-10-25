import pool from '../config/database.js'
import { categorizeItem } from '../services/openai.js'

/**
 * Get all items for a shopping list
 * GET /api/shopping-lists/:listId/items
 */
export async function getItemsByList(req, res) {
  try {
    const { listId } = req.params
    const userId = req.user.userId

    // Verify list belongs to user
    const listCheck = await pool.query(
      'SELECT id, store_id FROM shopping_lists WHERE id = $1 AND user_id = $2',
      [listId, userId]
    )

    if (listCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Shopping list not found' })
    }

    const result = await pool.query(
      `SELECT
        i.*,
        d.name as department_name,
        d.display_order as department_order
       FROM items i
       LEFT JOIN departments d ON i.department_id = d.id
       WHERE i.shopping_list_id = $1 AND i.status != 'deleted'
       ORDER BY d.display_order ASC, d.name ASC, i.added_at DESC`,
      [listId]
    )

    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Create new item with AI categorization
 * POST /api/shopping-lists/:listId/items
 */
export async function createItem(req, res) {
  try {
    const { listId } = req.params
    const { name, notes } = req.body
    const userId = req.user.userId

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Item name is required' })
    }

    // Verify list belongs to user and get store_id
    const listResult = await pool.query(
      'SELECT id, store_id FROM shopping_lists WHERE id = $1 AND user_id = $2',
      [listId, userId]
    )

    if (listResult.rows.length === 0) {
      return res.status(404).json({ message: 'Shopping list not found' })
    }

    const storeId = listResult.rows[0].store_id

    // Get departments for this store
    const deptResult = await pool.query(
      'SELECT id, name FROM departments WHERE store_id = $1',
      [storeId]
    )

    if (deptResult.rows.length === 0) {
      return res.status(400).json({
        message: 'No departments found for this store'
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
      `INSERT INTO items (shopping_list_id, department_id, name, notes, status, added_at)
       VALUES ($1, $2, $3, $4, 'active', CURRENT_TIMESTAMP)
       RETURNING *`,
      [listId, departmentId, name.trim(), notes || null]
    )

    // Get full item with department info
    const fullItem = await pool.query(
      `SELECT i.*, d.name as department_name, d.display_order as department_order
       FROM items i
       LEFT JOIN departments d ON i.department_id = d.id
       WHERE i.id = $1`,
      [result.rows[0].id]
    )

    res.status(201).json({
      ...fullItem.rows[0],
      ai_suggested_department: suggestedDepartmentName
    })
  } catch (error) {
    console.error('Error creating item:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Update item
 * PUT /api/items/:id
 */
export async function updateItem(req, res) {
  try {
    const { id } = req.params
    const { name, departmentId, notes } = req.body
    const userId = req.user.userId

    // Verify item belongs to user's shopping list
    const itemCheck = await pool.query(
      `SELECT i.id FROM items i
       JOIN shopping_lists sl ON i.shopping_list_id = sl.id
       WHERE i.id = $1 AND sl.user_id = $2`,
      [id, userId]
    )

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' })
    }

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
      return res.status(400).json({ message: 'No fields to update' })
    }

    values.push(id)

    const result = await pool.query(
      `UPDATE items SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating item:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Mark item as picked up
 * POST /api/items/:id/pickup
 */
export async function markItemPickedUp(req, res) {
  try {
    const { id } = req.params
    const userId = req.user.userId

    // Verify item belongs to user's shopping list
    const itemCheck = await pool.query(
      `SELECT i.id FROM items i
       JOIN shopping_lists sl ON i.shopping_list_id = sl.id
       WHERE i.id = $1 AND sl.user_id = $2`,
      [id, userId]
    )

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' })
    }

    const result = await pool.query(
      `UPDATE items
       SET status = 'picked_up', picked_up_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND status = 'active'
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Item not found or already picked up'
      })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error marking item as picked up:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Delete item (soft delete)
 * DELETE /api/items/:id
 */
export async function deleteItem(req, res) {
  try {
    const { id } = req.params
    const { permanent = false } = req.query
    const userId = req.user.userId

    // Verify item belongs to user's shopping list
    const itemCheck = await pool.query(
      `SELECT i.id FROM items i
       JOIN shopping_lists sl ON i.shopping_list_id = sl.id
       WHERE i.id = $1 AND sl.user_id = $2`,
      [id, userId]
    )

    if (itemCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' })
    }

    if (permanent === 'true') {
      // Hard delete
      const result = await pool.query(
        'DELETE FROM items WHERE id = $1 RETURNING *',
        [id]
      )

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

      res.json({ message: 'Item deleted', item: result.rows[0] })
    }
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export default {
  getItemsByList,
  createItem,
  updateItem,
  markItemPickedUp,
  deleteItem
}
