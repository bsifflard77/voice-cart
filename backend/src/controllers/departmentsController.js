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
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Department already exists for this store'
      })
    }
    if (error.code === '23503') {
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
