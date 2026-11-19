import { profile } from '@data/profile';
import { Icon } from './Icon';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p className="label" suppressHydrationWarning>
          {profile.handle}, {new Date().getFullYear()}
        </p>
        <a className="nav-link" href="#top">
          <Icon name="arrowUp" />
          Back to top
        </a>
      </div>
    </footer>
  );
}
