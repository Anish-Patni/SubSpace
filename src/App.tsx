import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from '@/router/routes'
import { CommandMenu } from '@/components/CommandMenu'
import { Toaster } from '@/components/ui/sonner'
import { CivicAuthProvider, CivicAuthIframeContainer } from '@civic/auth/react'
import { AdBlockerWarning } from '@/components/AdBlockerWarning'

const CIVIC_CLIENT_ID = '77550b1f-b202-46be-ae5f-4b8b4650abbe'

function App() {
  return (
    <CivicAuthProvider clientId={CIVIC_CLIENT_ID}>
      <Router>
        <CommandMenu />
        <AppRoutes />
        <Toaster />
        <CivicAuthIframeContainer />
        <AdBlockerWarning />
      </Router>
    </CivicAuthProvider>
  )
}

export default App
