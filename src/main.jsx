import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import posthog from 'posthog-js'

if (import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_KEY !== 'phc_YOUR_PROJECT_API_KEY') {
  console.log("PostHog: Initializing SDK with key:", import.meta.env.VITE_POSTHOG_KEY);
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true
  })
} else {
  console.warn("PostHog: Key not set or using placeholder, tracking disabled.");
}

createRoot(document.getElementById('root')).render(
  <Router>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Router>,
)
