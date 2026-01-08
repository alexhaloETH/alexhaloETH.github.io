import { MOBILE_REGEX } from './constants';

/**
 * Check if device can run Unity WebGL (WebGL2 + not mobile)
 * @returns {{ supported: boolean, reason?: string }}
 */
export function checkUnitySupport() {
  // Check if mobile device - Unity WebGL doesn't work well on mobile
  const isMobile = MOBILE_REGEX.test(navigator.userAgent);
  if (isMobile) {
    return { supported: false, reason: 'mobile' };
  }

  // Check WebGL2 support
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      return { supported: false, reason: 'webgl2' };
    }
  } catch {
    return { supported: false, reason: 'webgl2' };
  }

  return { supported: true };
}
