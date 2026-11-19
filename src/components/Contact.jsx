import { links, profile } from '@data/profile';
import useCopy from '@hooks/useCopy';
import { Icon } from './Icon';
import './Interlude.css';
import './Contact.css';

export default function Contact() {
  const [copied, copy] = useCopy(profile.email);
  // Let a long address wrap at the @ rather than mid-word on narrow phones.
  const at = profile.email.indexOf('@');

  return (
    <section id="contact" className="interlude interlude-contact" data-shot="contact" aria-labelledby="contact-title">
      <div className="wrap contact-inner">
        <h2 id="contact-title" className="contact-title">
          Got a role in mind?
        </h2>
        <p className="interlude-text">{profile.lookingFor} Email is the fastest way to reach me.</p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email.slice(0, at)}
          <wbr />
          {profile.email.slice(at)}
        </a>
        <div className="actions">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            <Icon name="mail" />
            Email me
          </a>
          <button className="btn btn-ghost" type="button" data-state={copied ? 'done' : undefined} onClick={copy}>
            <Icon name={copied ? 'check' : 'copy'} />
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </div>
        <ul className="profiles" aria-label="Profiles">
          <li>
            <a className="nav-link" href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="nav-link" href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a className="nav-link" href={links.discord} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </li>
        </ul>
        <p className="sr-only" aria-live="polite">
          {copied ? 'Email address copied' : ''}
        </p>
      </div>
    </section>
  );
}
