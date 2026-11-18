import { profile } from '../data/profile';
import './Header.css';

export default function Header() {
  return (
    <header className="top" id="top">
      <div className="wrap top-inner">
        <a className="wordmark" href="#top" aria-label={`${profile.handle}, back to top`}>
          {profile.handle}
        </a>
        <a className="btn btn-secondary btn-sm" href="#contact">
          Hire me
        </a>
      </div>
    </header>
  );
}
