import React, { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Chats = lazy(() => import("./pages/Chats.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));

const Navbar = lazy(() => import("./components/ui/NavBar.jsx"));
const Footer = lazy(() => import("./components/ui/Footer.jsx"));
import { Toaster } from "sonner";
import Loader from "./components/ui/Loader.jsx";
import { SocketProvider } from "./context/socketContext.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import { useSelector } from "react-redux";
import { toast } from "sonner";

//error boundary
const ErrorBoundary = lazy(() => import("./pages/ErrorBoundary.jsx"));

function App() {
  useEffect(() => {
    const hasToastBeenShown = localStorage.getItem("serverRestartToastShown");

    if (!hasToastBeenShown) {
      fetch("https://chat-app-backend-7mlw.onrender.com/")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Server not responding");
          }
        })
        .catch((error) => {
          console.error("Failed to wake up server:", error);
        });
      toast.message("Server Restarting", {
        description:
          "if content does not load, wait 59 seconds for server to restart",
      });

      // Mark that toast has been shown
      localStorage.setItem("serverRestartToastShown", "true");
    }
  }, []);
  const [isMobile, setIsMobile] = useState(false);
  //take width of device
  useEffect(() => {
    const windowSize = window.innerWidth < 768 ? true : false;
    setIsMobile(windowSize);
  }, []);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <SocketProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 1000,
                color: "#ffffff",
                cursor: "pointer",
              }}
              onClick={() =>
                window.open(
                  "https://github.com/adharsh-a",
                  "_blank"
                )
              }
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
              />
            </svg>{" "}
            <Navbar />
            <ErrorBoundary>
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/chats" element={<Chats />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  {isAuthenticated && (
                    <Route path="/profile" element={<Profile />} />
                  )}{" "}
                  <Route path="/about" element={<About />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
            <Footer />
          </Suspense>
        </BrowserRouter>
      </SocketProvider>
    </>
  );
}

export default App;
