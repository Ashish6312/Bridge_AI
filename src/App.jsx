import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalBackground from './components/GlobalBackground';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import DocsPage from './pages/DocsPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import ExtensionPage from './pages/ExtensionPage';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const BridgeRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile"   element={<ProfilePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/signup"    element={<LoginPage />} />
        <Route path="/docs"      element={<DocsPage />} />
        <Route path="/services"  element={<ServicesPage />} />
        <Route path="/about"     element={<AboutPage />} />
        <Route path="/extension" element={<ExtensionPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  React.useEffect(() => {
    // Sovereign Prelude: Wake up the hub immediately on mount
    const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '';
    fetch(`${API_BASE}/api/health`).catch(() => {});
  }, []);

  const location = useLocation();
  const hideChrome = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/dashboard';
  const hideNavbar = location.pathname === '/dashboard'; 

  // Real-Time Extension Sync (Global)
  React.useEffect(() => {
    const user = localStorage.getItem('bridge_user');
    if (user) {
      try {
        const event = new CustomEvent('BRIDGE_AUTH_UPDATE', { 
          detail: { user: JSON.parse(user) } 
        });
        window.dispatchEvent(event);
      } catch (e) {}
    }
  }, [location.pathname]); // Sync on every page navigation 

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <GlobalBackground />
          <Navbar />
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <BridgeRoutes />
          </div>
          <Footer />
        </div>
    </GoogleOAuthProvider>
  );
}

export default App;
