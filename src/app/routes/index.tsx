import { Routes, Route } from 'react-router-dom'

import Home from '../../features/home'
import Articles from '../../features/articles'
import Login from '../../features/auth/pages/Login'
import NotFound from '../../shared/components/layout/NotFound'
import PrivateRoute from '../../features/auth/components/PrivateRoute'
import Users from '../../features/users'
import Dashboard from '../../features/dashboard'
import Institutions from '../../features/institutions'
import PracticeReports from '../../features/practiceReports'
import { ToolboxPage } from '../../features/educationalMaterial'

// Módulo de banners
import BannerCreate from '../../features/banners'
import HistoricPublicView from '../../features/banners/pages/HistoricPublicView'
import HistoricAdminView from '../../features/banners/pages/HistoricAdminView'
// import HistoricPrivateView from '../../features/banners/pages/HistoricPrivateView' // (próximamente)

import {
  ADMIN_ROLE,
  STUDENT_ROLE,
  TEACHER_ROLE,
} from '../../shared/constants/cts'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articulos" element={<Articles />} />
      <Route path="/informes-practicas" element={<PracticeReports />} />
      <Route
        path="/instituciones"
        element={
          <PrivateRoute
            element={<Institutions />}
            requiredRoles={[ADMIN_ROLE]}
          />
        }
      />
      <Route
        path="/usuarios"
        element={
          <PrivateRoute element={<Users />} requiredRoles={[ADMIN_ROLE]} />
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute element={<Dashboard />} requiredRoles={[ADMIN_ROLE]} />
        }
      />

      {/* Rutas del módulo banner */}
      <Route
        path="/banners/create"
        element={
          <PrivateRoute
            element={<BannerCreate />}
            requiredRoles={[ADMIN_ROLE, TEACHER_ROLE, STUDENT_ROLE]}
          />
        }
      />
      <Route path="/banners/history_public" element={<HistoricPublicView />} />
      <Route path="/banners/history_public" element={<HistoricPublicView />} />

      <Route
        path="/banners/history"
        element={
          <PrivateRoute
            element={<HistoricAdminView />}
            requiredRoles={[ADMIN_ROLE, TEACHER_ROLE]}
          />
        }
      />

      <Route path="/caja-de-herramientas" element={<ToolboxPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
