import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Login from './Login'
import Register from './Register'

interface AuthWrapperProps {
  children: React.ReactNode
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isAuthenticated, loading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    )
  }

  return <>{children}</>
}

export default AuthWrapper
