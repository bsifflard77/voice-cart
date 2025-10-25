import pool from '../config/database.js'

/**
 * Get all shopping lists for the authenticated user
 * GET /api/shopping-lists
 */
export async function getUserLists(req, res) {
  try {
    const { status } = req.query // Filter by status: active, completed, archived
    const userId = req.user.userId

    let query = `
      SELECT
        sl.id,
        sl.user_id,
        sl.store_id,
        sl.name,
        sl.status,
        sl.created_at,
        sl.updated_at,
        sl.completed_at,
        sl.notes,
        s.name as store_name,
        COUNT(i.id) FILTER (WHERE i.status = 'active') as active_item_count,
        COUNT(i.id) FILTER (WHERE i.status = 'picked_up') as picked_up_count
      FROM shopping_lists sl
      JOIN stores s ON sl.store_id = s.id
      LEFT JOIN items i ON sl.id = i.shopping_list_id
      WHERE sl.user_id = $1
    `

    const params = [userId]

    if (status) {
      query += ` AND sl.status = $2`
      params.push(status)
    }

    query += `
      GROUP BY sl.id, s.name
      ORDER BY sl.created_at DESC
    `

    const result = await pool.query(query, params)

    res.json(result.rows)
  } catch (error) {
    console.error('Error fetching shopping lists:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Get a single shopping list by ID
 * GET /api/shopping-lists/:id
 */
export async function getListById(req, res) {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const result = await pool.query(
      `SELECT
        sl.*,
        s.name as store_name
      FROM shopping_lists sl
      JOIN stores s ON sl.store_id = s.id
      WHERE sl.id = $1 AND sl.user_id = $2`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shopping list not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching shopping list:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Create a new shopping list
 * POST /api/shopping-lists
 */
export async function createList(req, res) {
  try {
    const { storeId, name, notes } = req.body
    const userId = req.user.userId

    // Validate input
    if (!storeId || !name) {
      return res.status(400).json({ message: 'Store ID and name are required' })
    }

    // Verify store exists
    const storeCheck = await pool.query(
      'SELECT id FROM stores WHERE id = $1',
      [storeId]
    )

    if (storeCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid store ID' })
    }

    const result = await pool.query(
      `INSERT INTO shopping_lists (user_id, store_id, name, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, storeId, name, notes || null]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating shopping list:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Update a shopping list
 * PUT /api/shopping-lists/:id
 */
export async function updateList(req, res) {
  try {
    const { id } = req.params
    const { name, status, notes, storeId } = req.body
    const userId = req.user.userId

    // Verify list belongs to user
    const listCheck = await pool.query(
      'SELECT id FROM shopping_lists WHERE id = $1 AND user_id = $2',
      [id, userId]
    )

    if (listCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Shopping list not found' })
    }

    // Build update query dynamically
    const updates = []
    const values = []
    let paramCount = 1

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`)
      values.push(name)
      paramCount++
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`)
      values.push(status)
      paramCount++

      // If marking as completed, set completed_at
      if (status === 'completed') {
        updates.push(`completed_at = CURRENT_TIMESTAMP`)
      }
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`)
      values.push(notes)
      paramCount++
    }

    if (storeId !== undefined) {
      updates.push(`store_id = $${paramCount}`)
      values.push(storeId)
      paramCount++
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' })
    }

    values.push(id, userId)

    const result = await pool.query(
      `UPDATE shopping_lists
       SET ${updates.join(', ')}
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING *`,
      values
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating shopping list:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Delete a shopping list
 * DELETE /api/shopping-lists/:id
 */
export async function deleteList(req, res) {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const result = await pool.query(
      'DELETE FROM shopping_lists WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shopping list not found' })
    }

    res.json({ message: 'Shopping list deleted successfully' })
  } catch (error) {
    console.error('Error deleting shopping list:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

/**
 * Mark shopping list as completed
 * POST /api/shopping-lists/:id/complete
 */
export async function completeList(req, res) {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const result = await pool.query(
      `UPDATE shopping_lists
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Shopping list not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error('Error completing shopping list:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export default {
  getUserLists,
  getListById,
  createList,
  updateList,
  deleteList,
  completeList
}
