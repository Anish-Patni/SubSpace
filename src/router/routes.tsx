import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { AddSubscription } from '@/pages/AddSubscription'
import { SubscriptionDetails } from '@/pages/SubscriptionDetails'
import { Settings } from '@/pages/Settings'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add"
        element={
          <ProtectedRoute>
            <AddSubscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription/:id"
        element={
          <ProtectedRoute>
            <SubscriptionDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default AppRoutes
