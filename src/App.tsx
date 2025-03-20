import './App.css'
import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useAuthStore from './stores/useAuthStore'
import Header from './pages/components/sections/Header'
import Footer from './pages/components/sections/Footer'
import Register from './pages/components/auth/Register'
import Login from './pages/components/auth/Login'
import Home from './pages/home/Home'

function App() {
    const { checkAuth } = useAuthStore()
    let location = window.location.pathname

    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <BrowserRouter>
            <section className='max-w-7xl mx-auto bg-green-50'>
                {location !== '/registrarse' && location !== '/login' && (
                    <section className='flex flex-col min-h-screen'>
                        <Header />
                        <section className='flex-1'>
                            <Routes>
                                <Route path='/' element={<Home />} />
                            </Routes>
                        </section>
                        <section className='bg-green-200 h-10'>
                            <Footer />
                        </section>
                    </section>
                )}
                {location === '/registrarse' && <Register />}
                {location === '/login' && <Login />}
            </section>
        </BrowserRouter>
    )
}

export default App
