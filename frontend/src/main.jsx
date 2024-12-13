import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ModelProvider } from './context/ModelContext.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ModelProvider>
        <App />
      </ModelProvider>
    </AuthContextProvider>
  </StrictMode>,
)
