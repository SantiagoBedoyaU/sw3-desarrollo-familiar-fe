import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import useAuthStore from '@/app/stores/useAuthStore'
import AppRoutes from '@/app/routes'
import Header from '@/shared/components/layout/Header'
import Footer from '@/shared/components/layout/Footer'

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const location = window.location.pathname
  const isAuthPage = location === '/registrarse' || location === '/login'

  return (
    <BrowserRouter>
      <section className="w-full bg-blue-50">
        {isAuthPage ? (
          <AppRoutes />
        ) : (
          <section className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <footer className="bg-blue-200 h-10">
              <Footer />
            </footer>
          </section>
        )}
      </section>
    </BrowserRouter>
  )
}

export default App
