import { Landing } from '@/pages/Landing'
import { Dashboard } from '@/pages/Dashboard'
import { AddSubscription } from '@/pages/AddSubscription'
import { SubscriptionDetails } from '@/pages/SubscriptionDetails'
import { Settings } from '@/pages/Settings'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add" element={<AddSubscription />} />
      <Route path="/subscription/:id" element={<SubscriptionDetails />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default AppRoutes
