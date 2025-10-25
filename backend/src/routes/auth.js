import express from 'express'
import { body } from 'express-validator'
import * as authController from '../controllers/authController.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()

// Validation middleware
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').optional().trim(),
  body('lastName').optional().trim()
]

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
]

// Public routes
router.post('/register', registerValidation, authController.register)
router.post('/login', loginValidation, authController.login)

// Protected routes (require authentication)
router.get('/me', authMiddleware, authController.getProfile)
router.put('/profile', authMiddleware, authController.updateProfile)

export default router
