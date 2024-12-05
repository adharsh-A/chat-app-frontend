import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Lazy load pages
const Home = lazy(() => import('./pages/Home.jsx'))
const Chats = lazy(() => import('./pages/Chats.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Signup = lazy(() => import('./pages/Signup.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword.jsx'))
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
import About from './pages/About.jsx'
import { SocketProvider } from './context/socketContext.jsx'

function App() {
  const [isMobile, setIsMobile] = useState(false)
  //take width of device
  useEffect(() => {
    const windowSize = window.innerWidth < 768 ? true : false;
    setIsMobile(windowSize);
  }, []);
  return (
    <SocketProvider>
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Navbar />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </Suspense>
      <Toaster richColors expand={isMobile ? false : true} position={isMobile ? 'top-center' : 'bottom-right'} />
      </BrowserRouter>
    </SocketProvider>
  )
}

export default App