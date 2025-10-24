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
    if (error.code === '23505') {
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
