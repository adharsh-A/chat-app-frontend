import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Lazy load pages
const Home = lazy(() => import('./pages/Home.jsx'))
const Chats = lazy(() => import('./pages/Chats.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Signup = lazy(() => import('./pages/Signup.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('./pages/ResetPassword.jsx'))
// import NotFound from './pages/NotFound.jsx'
// import Signup from './pages/Signup.jsx'
// import ForgotPassword from './pages/ForgotPassword.jsx'
// import Navbar from './components/ui/NavBar.jsx'
// import Home from './pages/Home.jsx'
// import Chats from './pages/Chats.jsx'
// import Footer from './components/ui/Footer.jsx' 
// Lazy load UI components
const Navbar = lazy(() => import('./components/ui/NavBar.jsx'))
const Footer = lazy(() => import('./components/ui/Footer.jsx'))
import { Toaster } from 'sonner'
import Loader from './components/ui/Loader.jsx'
import { SocketProvider } from './context/socketContext.jsx'
import About from './pages/About.jsx'
import Profile from './pages/Profile.jsx'
import { useSelector } from 'react-redux'

//error boundary
const ErrorBoundary = lazy(() => import('./pages/ErrorBoundary.jsx'))

function App() {
  const [isMobile, setIsMobile] = useState(false)
  //take width of device
  useEffect(() => {
    const windowSize = window.innerWidth < 768 ? true : false;
    setIsMobile(windowSize);
  }, []);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <>
    <SocketProvider >
      <BrowserRouter>
      <Suspense fallback={<Loader />}>
            <Navbar />
            <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
{isAuthenticated &&                <Route path="/profile" element={<Profile />} />
}            <Route path="/about" element={<About />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
              </Suspense>
        </ErrorBoundary>
        <Footer />
      </Suspense>
      <Toaster richColors expand={isMobile ? false : true} position={isMobile ? 'top-center' : 'bottom-right'} />
      </BrowserRouter>
    </SocketProvider>
    </>
  )
}

export default App