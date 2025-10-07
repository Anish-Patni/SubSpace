import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '@/router/routes'
import { CommandMenu } from '@/components/CommandMenu'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/context/AuthContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <CommandMenu />
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  )
}

export default App
