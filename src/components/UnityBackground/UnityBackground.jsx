import { Unity, useUnityContext } from 'react-unity-webgl';
import { UNITY_BUILD_PATHS } from '../../utils/constants';
import './UnityBackground.css';

function UnityBackground() {
  const { unityProvider, isLoaded } = useUnityContext(UNITY_BUILD_PATHS);

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
  );
}

export default UnityBackground;
