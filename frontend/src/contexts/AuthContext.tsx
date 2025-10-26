import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'
import * as api from '../services/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await api.getProfile()
          setUser(userData)
        } catch (error) {
          console.error('Failed to get user profile:', error)
          // Token might be expired, clear it
          api.logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password })
      setUser(response.user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await api.register({ email, password, firstName, lastName })
      setUser(response.user)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
