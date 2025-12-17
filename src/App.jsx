import { useState, useCallback, lazy, Suspense } from 'react'
import HeroCard from './components/HeroCard/HeroCard.jsx'
import SkillsCard from './components/SkillsCard/SkillsCard.jsx'
import ExperienceCard from './components/ExperienceCard/ExperienceCard.jsx'
import ProjectsCard from './components/ProjectsCard/ProjectsCard.jsx'
import Toast from './components/Toast/Toast.jsx'
import StarsBackground from './components/StarsBackground/StarsBackground.jsx'
import UnityBackground from './components/UnityBackground/UnityBackground.jsx'
import LoginModal from './components/LoginModal/LoginModal.jsx'
import SecretDashboard from './components/SecretDashboard/SecretDashboard.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import useIdleDetection from './hooks/useIdleDetection'
import { checkUnitySupport } from './utils/deviceDetection'
import { IDLE_TIMEOUT } from './utils/constants'
import './App.css'

// Lazy load the WorldCard to prevent blocking initial render
const WorldCard = lazy(() => import('./components/MapCard/WorldCard.jsx'))

function AppContent() {
  const [unityEnabled, setUnityEnabled] = useState(false)
  const [unityMounted, setUnityMounted] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const isIdle = useIdleDetection(IDLE_TIMEOUT, unityEnabled)
  const { showSecretPortal } = useAuth()

  const handleToggle3D = useCallback(() => {
    if (!unityEnabled) {
      const support = checkUnitySupport()
      if (!support.supported) {
        if (support.reason === 'mobile') {
          setToastMessage('3D background is not available on mobile devices. Please visit on a desktop browser.')
        } else {
          setToastMessage('3D background requires WebGL2 which is not supported on this device/browser.')
        }
        return
      }
      setUnityMounted(true)
      setUnityEnabled(true)
    } else {
      setUnityEnabled(false)
    }
  }, [unityEnabled])

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <LoginModal />

      <div className="background-container">
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
      </div>

      {showSecretPortal ? (
        <SecretDashboard />
      ) : (
        <div className={`portfolio ${isIdle ? 'screensaver' : ''}`}>
          <header className="header">
            <span className="header-name">ALEXHALO</span>
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
          </header>

          <main className="card-grid">
            <HeroCard />
            <SkillsCard />
            <ExperienceCard />
            <ProjectsCard />
            <Suspense fallback={<div className="card" style={{ background: 'rgba(20, 20, 20, 0.8)' }} />}>
              <WorldCard />
            </Suspense>
          </main>
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
