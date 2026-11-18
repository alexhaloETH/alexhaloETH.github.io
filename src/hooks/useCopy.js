import { useCallback, useEffect, useRef, useState } from 'react';

// Copy text to the clipboard and report success for a moment.
// navigator.clipboard needs a secure context, so plain-http previews fall back to
// a hidden textarea. If both fail, the address stays visible on the page to copy.
export default function useCopy(text, resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        if (!ok) return;
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), resetMs);
    } catch {
      // Leave the visible address for the reader to copy by hand.
    }
  }, [text, resetMs]);

  return [copied, copy];
}
