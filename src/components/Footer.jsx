import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="footer">
      {/* The year is baked in at build time; the browser may disagree after New Year. */}
      <div className="wrap" suppressHydrationWarning>
        {profile.handle}, {new Date().getFullYear()}
      </div>
    </footer>
  );
}
