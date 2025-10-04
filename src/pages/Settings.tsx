import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { User, Bell, CreditCard, Shield, Trash2 } from 'lucide-react'
import { useUser } from '@civic/auth/react'

export const Settings = () => {
  const { user } = useUser()
  
  const [notifications, setNotifications] = useState({
    emailReminders: true,
    renewalAlerts: true,
    weeklyReport: false,
    priceChanges: true
  })

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    currency: 'USD'
  })

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        currency: 'USD'
      })
    }
  }, [user])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--nb-bg)', color: 'var(--nb-ink)' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-6xl font-black mb-12 tracking-tight">Settings</h1>

        {/* Profile Settings */}
        <div 
          className="rounded-3xl border-2 p-10 mb-6"
          style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-border)' }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--nb-accent)' }}>
              <User className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Profile</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block font-bold mb-3 text-lg">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 font-semibold focus:outline-none focus:border-gray-400 transition-colors"
                style={{ borderColor: 'var(--nb-border)' }}
              />
            </div>

            <div>
              <label className="block font-bold mb-3 text-lg">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 font-semibold focus:outline-none focus:border-gray-400 transition-colors"
                style={{ borderColor: 'var(--nb-border)' }}
              />
            </div>

            <div>
              <label className="block font-bold mb-3 text-lg">Currency</label>
              <select
                value={profile.currency}
                onChange={(e) => setProfile({...profile, currency: e.target.value})}
                className="w-full px-5 py-4 rounded-xl border-2 font-semibold focus:outline-none focus:border-gray-400 transition-colors"
                style={{ borderColor: 'var(--nb-border)' }}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>

            <button 
              className="px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: 'var(--nb-ok)' }}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div 
          className="rounded-3xl border-2 p-10 mb-6"
          style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-border)' }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--nb-accent-2)' }}>
              <Bell size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Notifications</h2>
          </div>

          <div className="space-y-5">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-5 rounded-xl border-2" style={{ borderColor: 'var(--nb-border)' }}>
                <div>
                  <p className="font-bold text-lg">
                    {key === 'emailReminders' && 'Email Reminders'}
                    {key === 'renewalAlerts' && 'Renewal Alerts'}
                    {key === 'weeklyReport' && 'Weekly Report'}
                    {key === 'priceChanges' && 'Price Change Alerts'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {key === 'emailReminders' && 'Get email notifications for upcoming renewals'}
                    {key === 'renewalAlerts' && 'Alert me 3 days before subscription renewal'}
                    {key === 'weeklyReport' && 'Receive weekly spending summary'}
                    {key === 'priceChanges' && 'Notify when subscription prices change'}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({...notifications, [key]: !value})}
                  className={`w-16 h-8 rounded-full transition-all ${value ? 'justify-end' : 'justify-start'} flex items-center px-1`}
                  style={{ backgroundColor: value ? 'var(--nb-ok)' : 'var(--nb-border)' }}
                >
                  <div className="w-6 h-6 rounded-full bg-white shadow-md"></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div 
          className="rounded-3xl border-2 p-10 mb-6"
          style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-border)' }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--nb-accent-4)' }}>
              <CreditCard className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Payment Methods</h2>
          </div>

          <div className="space-y-4 mb-6">
            {['Visa ****1234', 'Mastercard ****5678'].map((card, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 rounded-xl border-2" style={{ borderColor: 'var(--nb-border)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--nb-bg)' }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{card}</p>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                </div>
                <button className="px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button 
            className="px-8 py-4 rounded-xl font-bold border-2 hover:bg-gray-50 transition-colors"
            style={{ borderColor: 'var(--nb-border)' }}
          >
            + Add Payment Method
          </button>
        </div>

        {/* Security */}
        <div 
          className="rounded-3xl border-2 p-10 mb-6"
          style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-border)' }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--nb-accent-3)' }}>
              <Shield className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Security</h2>
          </div>

          <div className="space-y-4">
            <button 
              className="w-full px-6 py-4 rounded-xl font-bold text-left border-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--nb-border)' }}
            >
              Change Password
            </button>
            <button 
              className="w-full px-6 py-4 rounded-xl font-bold text-left border-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--nb-border)' }}
            >
              Enable Two-Factor Authentication
            </button>
            <button 
              className="w-full px-6 py-4 rounded-xl font-bold text-left border-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--nb-border)' }}
            >
              Download My Data
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div 
          className="rounded-3xl border-2 p-10"
          style={{ backgroundColor: 'var(--nb-card)', borderColor: 'var(--nb-error)' }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--nb-error)' }}>
              <Trash2 className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">Danger Zone</h2>
          </div>

          <p className="text-gray-600 mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <button 
            className="px-8 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: 'var(--nb-error)' }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
