import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import HeroCard from './components/HeroCard.jsx'
import SkillsCard from './components/SkillsCard/SkillsCard.jsx'
import ExperienceCard from './components/ExperienceCard/ExperienceCard.jsx'
import ProjectsCard from './components/ProjectsCard/ProjectsCard.jsx'
import ContactCard from './components/ContactCard/ContactCard.jsx'
import './App.css'
import './components/HeroCard.css'

// Lazy load the WorldCard to prevent blocking initial render
const WorldCard = lazy(() => import('./components/MapCard/WorldCard.jsx'))

const IDLE_TIMEOUT = 60000 // 1 minute in milliseconds

// Check if device can run Unity WebGL (WebGL2 + not mobile)
function checkUnitySupport() {
  // Check if mobile device - Unity WebGL doesn't work well on mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  if (isMobile) {
    return { supported: false, reason: 'mobile' }
  }

  // Check WebGL2 support
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) {
      return { supported: false, reason: 'webgl2' }
    }
  } catch (e) {
    return { supported: false, reason: 'webgl2' }
  }

  return { supported: true }
}

// Toast notification component
function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="toast">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  )
}

function StarsBackground() {
  const stars = Array.from({ length: 30 }, (_, i) => (
    <div key={i} className="star" />
  ))

  return (
    <div className="stars-background">
      <div className="stars">{stars}</div>
    </div>
  )
}

function UnityBackground() {
  const { unityProvider, isLoaded } = useUnityContext({
    loaderUrl: '/unity-build/Portfolio.loader.js',
    dataUrl: '/unity-build/Portfolio.data',
    frameworkUrl: '/unity-build/Portfolio.framework.js',
    codeUrl: '/unity-build/Portfolio.wasm',
  })

  return (
    <div className="unity-container">
      {!isLoaded && (
        <div className="unity-loading">
          <span>Loading 3D...</span>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

function useIdleDetection(timeout, enabled) {
  const [isIdle, setIsIdle] = useState(false)

  const resetIdle = useCallback(() => {
    setIsIdle(false)
  }, [])

  useEffect(() => {
    if (!enabled) {
      setIsIdle(false)
      return
    }

    let timeoutId

    const handleActivity = () => {
      setIsIdle(false)
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => setIsIdle(true), timeout)
    }

    // Set up event listeners for user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach(event => window.addEventListener(event, handleActivity))

    // Start the initial timeout
    timeoutId = setTimeout(() => setIsIdle(true), timeout)

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity))
      clearTimeout(timeoutId)
    }
  }, [timeout, enabled])

  return isIdle
}

function App() {
  const [unityEnabled, setUnityEnabled] = useState(false)
  const [unityMounted, setUnityMounted] = useState(false) // Track if Unity should be mounted
  const [toastMessage, setToastMessage] = useState(null)
  const isIdle = useIdleDetection(IDLE_TIMEOUT, unityEnabled)

  const handleToggle3D = useCallback(() => {
    if (!unityEnabled) {
      // Trying to enable 3D - check device support first
      const support = checkUnitySupport()
      if (!support.supported) {
        if (support.reason === 'mobile') {
          setToastMessage('3D background is not available on mobile devices. Please visit on a desktop browser.')
        } else {
          setToastMessage('3D background requires WebGL2 which is not supported on this device/browser.')
        }
        return
      }
      setUnityMounted(true) // Mount Unity component
      setUnityEnabled(true)
    } else {
      setUnityEnabled(false)
      // Keep Unity mounted to avoid re-downloading, just hide it
    }
  }, [unityEnabled])

  return (
    <>
      {/* Toast notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Background Layer */}
      <div className="background-container">
        {/* Stars Background - always rendered, fades out when Unity is on */}
        <div className={`background-layer ${unityEnabled ? 'hidden' : ''}`}>
          <StarsBackground />
        </div>

        {/* Unity Background - only mounted after user clicks 3D button */}
        {unityMounted && (
          <div className={`background-layer ${unityEnabled ? '' : 'hidden'}`}>
            <UnityBackground />
            <div className={`background-overlay ${isIdle ? 'screensaver' : ''}`} />
          </div>
        )}

        {/* Faint light overlay on top of all backgrounds */}
        <div className="background-light-overlay" />
      </div>

      {/* Main Content */}
      <div className={`portfolio ${isIdle ? 'screensaver' : ''}`}>
        {/* Header */}
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

        {/* Card Grid */}
        <main className="card-grid">
          {/* Card 1 - Hero/Intro */}
          <HeroCard />

          {/* Card 2 - Skills */}
          <SkillsCard />

          {/* Card 3 - Experience */}
          <ExperienceCard />

          {/* Card 4 - Projects (wide - spans 2 columns) */}
          <ProjectsCard />

          {/* Card 5 - World Map */}
          <Suspense fallback={<div className="card" style={{ background: 'rgba(20, 20, 20, 0.8)' }} />}>
            <WorldCard />
          </Suspense>

          {/* Card 6 - Contact (NEW - uncomment to add) */}
          {/* <ContactCard /> */}
        </main>
      </div>
    </>
  )
}

export default App
