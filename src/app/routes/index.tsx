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
import PracticeReports from '../../features/practiceReports'
import { ToolboxPage } from '../../features/educationalMaterial'

// Módulo de banners
import BannerCreate from '../../features/banners' // index.tsx con formulario
// import BannerHistory from '../../features/banners/pages/BannerHistory' (a futuro)

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articulos" element={<Articles />} />
      <Route path="/informes-practicas" element={<PracticeReports />} />
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

      {/* Rutas para publicaciones en el banner */}
      <Route
        path="/banners/create"
        element={
          <PrivateRoute element={<BannerCreate />} requiredRoles={[0, 1, 2]} />
        }
      />
      {/* <Route
        path="/banners/history"
        element={
          <PrivateRoute element={<BannerHistory />} requiredRoles={[0, 1, 2]} />
        }
      /> */}

      <Route path="/caja-de-herramientas" element={<ToolboxPage />} />
      <Route path="/registrarse" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
