import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import AuthWrapper from './components/AuthWrapper.tsx'
import { registerServiceWorker } from './utils/registerServiceWorker'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </AuthProvider>
  </React.StrictMode>,
)

// Register service worker for PWA support
registerServiceWorker()
