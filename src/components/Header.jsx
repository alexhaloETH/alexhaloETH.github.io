import { useEffect, useState } from 'react';
import { profile } from '@data/profile';
import './Header.css';

const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#toolkit', label: 'Toolkit' },
];

export default function Header() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="top" data-solid={solid ? '' : undefined}>
      <div className="wrap top-inner">
        <a className="wordmark" href="#top" aria-label={`${profile.handle}, back to top`}>
          {profile.handle}
        </a>
        <nav className="top-nav" aria-label="Sections">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <a className="nav-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-ghost btn-sm" href="#contact">
          Contact
        </a>
      </div>
    </header>
  );
}
