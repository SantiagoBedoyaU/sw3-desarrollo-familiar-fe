import { Routes, Route } from 'react-router-dom'

import Home from '../../features/home'
import Articles from '../../features/articles'
import Register from '../../features/auth/pages/Register'
import Login from '../../features/auth/pages/Login'
import NotFound from '../../shared/components/layout/NotFound'
import PrivateRoute from '../../features/auth/components/PrivateRoute'
import Users from '../../features/users'
import Dashboard from '../../features/dashboard'
import Institutions from '../../features/institutions'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articulos" element={<Articles />} />
      <Route
        path="/instituciones"
        element={
          <PrivateRoute element={<Institutions />} requiredRoles={[1]} />
        }
      />

      <Route
        path="/usuarios"
        element={<PrivateRoute element={<Users />} requiredRoles={[1]} />}
      />
      <Route
        path="/dashboard"
        element={<PrivateRoute element={<Dashboard />} requiredRoles={[1]} />}
      />
      <Route path="/registrarse" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
