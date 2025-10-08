import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '@/router/routes'
import { CommandMenu } from '@/components/CommandMenu'
import { Toaster } from '@/components/ui/sonner'
import { CivicAuthProvider } from '@/context/CivicAuthProvider'

function App() {
  return (
    <Router>
      <CivicAuthProvider>
        <CommandMenu />
        <AppRoutes />
        <Toaster />
      </CivicAuthProvider>
    </Router>
  )
}

export default App
