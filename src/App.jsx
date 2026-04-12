import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import HeroCard from './components/HeroCard/HeroCard.jsx'
import SkillsCard from './components/SkillsCard/SkillsCard.jsx'
import ExperienceCard from './components/ExperienceCard/ExperienceCard.jsx'
import ProjectsCard from './components/ProjectsCard/ProjectsCard.jsx'
import WorldCard from './components/MapCard/WorldCard.jsx'
import Toast from './components/Toast/Toast.jsx'
import StarsBackground from './components/StarsBackground/StarsBackground.jsx'
import UnityBackground from './components/UnityBackground/UnityBackground.jsx'
import LoginModal from './components/LoginModal/LoginModal.jsx'
import SecretDashboard from './components/SecretDashboard/SecretDashboard.jsx'
import LoadingAnimation from './components/LoadingAnimation/LoadingAnimation.jsx'
import ExitAnimation from './components/ExitAnimation/ExitAnimation.jsx'
import SecretBackground from './components/SecretBackground/SecretBackground.jsx'
import PiDisplay from './pi-display/PiDisplay.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { NotificationProvider, useNotification } from './contexts/NotificationContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher.jsx'
import useIdleDetection from './hooks/useIdleDetection'
import { checkUnitySupport } from './utils/deviceDetection'
import { IDLE_TIMEOUT } from './utils/constants'
import './App.css'

function restoreGitHubPagesRoute() {
  try {
    const params = new URLSearchParams(window.location.search)
    const queryRedirect = params.get('spa_redirect')
    if (queryRedirect) {
      window.history.replaceState(null, '', queryRedirect)
      return
    }

    const redirect = window.sessionStorage.getItem('portfolio_spa_redirect')
    if (redirect) {
      window.sessionStorage.removeItem('portfolio_spa_redirect')
      window.history.replaceState(null, '', redirect)
    }
  } catch (error) {
    console.warn('Failed to restore SPA redirect:', error)
  }
}

restoreGitHubPagesRoute()

const isPiDisplayRoute = () => {
  const route = window.location.pathname.replace(/\/+$/, '')
  const params = new URLSearchParams(window.location.search)
  return route === '/pi-display' || params.get('display') === 'pi'
}

function AppContent() {
  const [unityEnabled, setUnityEnabled] = useState(false)
  const [unityMounted, setUnityMounted] = useState(false)
  const isIdle = useIdleDetection(IDLE_TIMEOUT, unityEnabled)
  const { showSecretPortal, isLoadingDashboard, isExitingDashboard } = useAuth()
  const { notification, showNotification, closeNotification } = useNotification()

  const handleToggle3D = useCallback(() => {
    if (!unityEnabled) {
      const support = checkUnitySupport()
      if (!support.supported) {
        showNotification({
          title: '3D Not Available',
          message: support.reason === 'mobile'
            ? '3D background is not available on mobile devices. Please visit on a desktop browser.'
            : '3D background requires WebGL2 which is not supported on this device/browser.',
          type: 'warning',
          duration: 5000
        })
        return
      }
      setUnityMounted(true)
      setUnityEnabled(true)
    } else {
      setUnityEnabled(false)
    }
  }, [unityEnabled, showNotification])

  if (isPiDisplayRoute()) {
    return <PiDisplay />
  }

  return (
    <>
      {/* Global notification system */}
      <AnimatePresence>
        {notification && (
          <Toast
            title={notification.title}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>

      <LoginModal />

      {/* Show loading animation while transitioning to secret dashboard */}
      <AnimatePresence>
        {isLoadingDashboard && <LoadingAnimation />}
      </AnimatePresence>

      {/* Show exit animation while transitioning back to portfolio */}
      <AnimatePresence>
        {isExitingDashboard && <ExitAnimation />}
      </AnimatePresence>

      {/* Background layer - hide stars and unity when in secret portal */}
      <div className="background-container">
        {showSecretPortal ? (
          <SecretBackground />
        ) : (
          <>
            <div className={`background-layer ${unityEnabled ? 'hidden' : ''}`}>
              <StarsBackground />
            </div>

            {unityMounted && (
              <div className={`background-layer ${unityEnabled ? '' : 'hidden'}`}>
                <UnityBackground />
                <div className={`background-overlay ${isIdle ? 'screensaver' : ''}`} />
              </div>
            )}

            <div className="background-light-overlay" />
          </>
        )}
      </div>

      {showSecretPortal ? (
        <SecretDashboard />
      ) : (
        <div className={`portfolio ${isIdle ? 'screensaver' : ''}`}>
          <header className="header">
            <span className="header-name">ALEXHALO</span>
            <div className="header-buttons">
              <ThemeSwitcher />
              <button
                className={`toggle-btn ${unityEnabled ? 'active' : ''}`}
                onClick={handleToggle3D}
              >
                <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {unityEnabled ? (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  ) : (
                    <circle cx="12" cy="12" r="5" />
                  )}
                </svg>
                <span>{unityEnabled ? '3D On' : '3D Off'}</span>
              </button>
            </div>
          </header>

          <main className="card-grid">
            <HeroCard />
            <SkillsCard />
            <ExperienceCard />
            <ProjectsCard />
            <WorldCard />
          </main>
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppWithNotifications />
      </NotificationProvider>
    </ThemeProvider>
  )
}

function AppWithNotifications() {
  const { showNotification } = useNotification()

  return (
    <AuthProvider showNotification={showNotification}>
      <AppContent />
    </AuthProvider>
  )
}

export default App
