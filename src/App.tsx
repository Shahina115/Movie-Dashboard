import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routing/ProtectedRoute.tsx'
import { DashboardPage } from './screens/DashboardPage.tsx'
import { LoginPage } from './screens/LoginPage.tsx'
import { SignupPage } from './screens/SignupPage.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
