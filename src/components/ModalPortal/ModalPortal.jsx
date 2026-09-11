import { createPortal } from 'react-dom';

/**
 * Renders modal content at document.body.
 *
 * Every dashboard modal is `position: fixed` with `inset: 0`, which should make
 * it viewport-sized. It does not, because `.secret-card` sets
 * `backdrop-filter`, and a backdrop-filter creates a containing block for
 * fixed-position descendants exactly as a transform does. Fixed then resolves
 * against the card instead of the viewport, so the overlay is sized and centred
 * inside the card. On a short card that is a small offset nobody notices; on the
 * trading bots card, which ran to 119,834px with 416 rows, it centred the dialog
 * some sixty thousand pixels down the page.
 *
 * Portalling out of the card is the fix: at document.body there is no
 * backdrop-filter ancestor, so fixed means fixed.
 */
function ModalPortal({ children }) {
  if (typeof document === 'undefined') return null;
  // The wrapper carries a class the dashboard's shared modal rules can hook,
  // since portalling out of .secret-dashboard would otherwise drop the z-index
  // and the max-height that keeps a tall dialog inside the viewport.
  return createPortal(
    <div className="dashboard-modal-root">{children}</div>,
    document.body,
  );
}

export default ModalPortal;
