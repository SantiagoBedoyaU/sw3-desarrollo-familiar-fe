import { Routes, Route } from 'react-router-dom'

import Home from '../../features/home'
import Articles from '../../features/articles'
import Register from '../../features/auth/pages/Register'
import Login from '../../features/auth/pages/Login'
import NotFound from '../../shared/components/layout/NotFound'
import PrivateRoute from '../../features/auth/components/PrivateRoute'
import Users from '../../features/users'
// import PrivateRoute from '@/shared/components/PrivateRoute'
// import PracticeReports from '@/features/practiceReports'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/informes-practicas" element={<PrivateRoute element={<PracticeReports />} />} /> */}
      <Route path="/articulos" element={<Articles />} />
      <Route path="/usuarios" element={<PrivateRoute element={<Users />} />} />
      <Route path="/registrarse" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
