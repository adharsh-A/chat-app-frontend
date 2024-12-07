import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUser, FaFileAlt } from 'react-icons/fa';
import { GoHomeFill } from 'react-icons/go';
import { Link } from 'react-router-dom'; // Use react-router-dom for routing
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/authSlice';
import Modal from './Modal';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavMenu } from './NavMenu';


function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
 
  const [activeTab, setActiveTab] = useState('Home');
  const [isMobile, setIsMobile] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);

  useEffect(() => {
    // Get active tab from URL path
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('Home');
    } else {
      // Remove leading slash and capitalize first letter
      const tabName = path.substring(1).charAt(0).toUpperCase() + path.slice(2);
      setActiveTab(tabName);
    }
  }, [location]);

  // Rest of the component code remains the same   const [activeTab, setActiveTab] = useState('Home');

  const tabs = [
    { name: 'Home', url: '/', icon: <GoHomeFill /> },
    { name: 'Chats', url: '/chats', icon: <FaBriefcase /> },
    { name: 'About', url: '/about', icon: <FaFileAlt /> },
  ];
  if (!isAuthenticated) {
    tabs.push({ name: 'Login', url: '/login', icon: <FaUser /> });
  }
  if(isAuthenticated){
    tabs.push({ name: "Logout",icon:<FaUser />,isLogout:true });
  }
  const handleLogout = () => {
    setLogoutDialog(false);
    dispatch(logout());
    navigate('/'); // React Router navigation
    setTimeout(() => {
        window.location.reload();
    }, 100); // Adjust the delay if necessary
};

  const handleLogoutDialog = () => {
    setLogoutDialog((prev)=>!prev);
  }
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize); 

    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  const getLeftPosition = (tabName) => {
    if (isMobile) {
      // Mobile view
      switch (tabName) {
        case 'Home':
          return 'calc(0% + 16px)';
        case 'Chats':
          return 'calc(23% + 2px)';
        case 'About':
          return 'calc(22% + 2px)';
        case 'Login':
          return 'calc(22% + 2px)';
      }
    } else {
      // Desktop view
      switch (tabName) {
        case 'Home':
          return 'calc(0% + 44px)';
        case 'Chats':
          return 'calc(30% + 2px)';
        case 'About':
          return 'calc(32% + 2px)';
        case 'Login':
          return 'calc(32% + 2px)';
      }
    }
  };
  if(location.pathname.includes('/chats')) return null;

  return (
    <>
    <div className="fixed bottom-0 sm:top-0 h-16 left-1/2 transform -translate-x-1/2 z-50 mb-6 sm:pt-6">
      <div className="flex items-center gap-3 bg-white/5 border border-gray-500/20 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg shadow-black">
        {tabs.map((tab) =>tab.isLogout?(  <button
              key={tab.name}
              onClick={handleLogoutDialog} // Handle logout function
              className={`relative cursor-pointer text-sm text-white px-6 py-2 rounded-full ${
                activeTab === tab.name ? 'bg-zinc-500' : ''
              }`}
              style={{
                backdropFilter: 'blur(10px)',
                backgroundColor:
                  activeTab === tab.name ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              }}
            >
              <span className="hidden md:inline">{tab.name}</span>
              <span className="md:hidden">{tab.icon}</span>
            </button>): (
          <Link
            key={tab.name}
            to={tab.url} // Using react-router's Link component
            onClick={() => setActiveTab(tab.name)}
            className={`relative cursor-pointer text-sm text-white px-6 py-2 rounded-full ${
              activeTab === tab.name ? 'bg-zinc-500' : ''
            }`}
            style={{
              backdropFilter: 'blur(10px)',
              backgroundColor:
                activeTab === tab.name ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            }}
          >
            <span className="hidden md:inline">{tab.name}</span>
            <span className="md:hidden">{tab.icon}</span>
            {activeTab === tab.name && (
              <motion.div
                layoutId="lamp"
                className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-8 h-1 bg-white rounded-t-md"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
                style={{ left: getLeftPosition(tab.name) }}
              >
                {/* Lamp elements */}
                <motion.div className="absolute w-10 h-12 bg-white rounded-full blur shadow-lg opacity-10 -top-3" />
                <motion.div className="absolute w-12 h-12 bg-white rounded-full blur shadow-lg opacity-20 -top-3 -left-1" />
                <motion.div className="absolute w-8 h-8 bg-white rounded-full blur shadow-lg opacity-10 -top-2" />
                <motion.div className="absolute w-6 h-6 bg-white rounded-full blur shadow-lg opacity-10 -top-1" />
              </motion.div>
            )}
          </Link>
        ))}
{isAuthenticated &&        <NavMenu className="ml-auto" />
}        </div>
      </div>
      {logoutDialog?<Modal isOpen={logoutDialog} text="Logout?" description="Are you sure you want to logout?" rightBtn="Yes" leftBtn="No" functionSubmit={handleLogout} handleClose={handleLogoutDialog} />: null}
    </>
  );
}

export default Navbar;
