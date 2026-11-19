import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build is prerendered, so hydrate when the markup is already there.
if (root.firstElementChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}

// The 3D scene loads after the page is idle, so it never delays the content. It is
// skipped on data saver; the CSS sky in base.css stays in its place.
const canvas = document.getElementById('scene');
const saveData = navigator.connection && navigator.connection.saveData;

function startScene() {
  import('./scene/scene.js')
    .then(({ startScene: start }) => start(canvas))
    .then((scene) => {
      window.__scene = scene;
    })
    .catch(() => {
      canvas.dataset.state = 'failed';
    });
}

if (canvas && !saveData) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(startScene, { timeout: 2000 });
  } else {
    window.setTimeout(startScene, 600);
  }
}
