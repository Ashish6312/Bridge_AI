import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalBackground from './components/GlobalBackground';
import ChatWidget from './components/ChatWidget';

// Lazy Loaded Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DocsPage = lazy(() => import('./pages/DocsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ExtensionPage = lazy(() => import('./pages/ExtensionPage'));
const LogoutPage = lazy(() => import('./pages/LogoutPage'));
const SEOContentPage = lazy(() => import('./pages/SEOContentPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('bridge_user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const BridgeRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" onExitComplete={() => {
      if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/extension" element={<ExtensionPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/industries/:slug" element={<SEOContentPage type="industries" />} />
        <Route path="/solutions/:slug" element={<SEOContentPage type="problems" />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </AnimatePresence>
  );
};

const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    width: '100%',
    flexDirection: 'column',
    gap: '20px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '3px solid var(--primary-soft)',
      borderTopColor: 'var(--primary)',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  React.useEffect(() => {
    // Sovereign Prelude: Wake up the hub immediately on mount
    const API_BASE = import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '';
    fetch(`${API_BASE}/api/health`).catch(() => { });
  }, []);

  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  // Smooth scroll to top on page path changes
  React.useEffect(() => {
    if (!location.hash) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]);

  // Real-Time Extension Sync (Global)
  React.useEffect(() => {
    const user = localStorage.getItem('bridge_user');
    if (user) {
      try {
        const event = new CustomEvent('BRIDGE_AUTH_UPDATE', {
          detail: { user: JSON.parse(user) }
        });
        window.dispatchEvent(event);
      } catch (e) { }
    }
  }, [location.pathname]); // Sync on every page navigation 

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ChatWidget />
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-main)' }}>
        <GlobalBackground />
        <Navbar />
        <main style={{ flex: 1, position: 'relative' }}>
          <Suspense fallback={<PageLoader />}>
            <BridgeRoutes />
          </Suspense>
        </main>
        <Footer />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
