import { links, profile } from '../data/profile';
import useCopy from '../hooks/useCopy';
import { Icon } from './Icon';
import './Contact.css';

export default function Contact() {
  const [copied, copy] = useCopy(profile.email);

  return (
    <section id="contact" className="contact wrap" aria-labelledby="contact-title">
      <div className="card card-raised contact-card">
        <div>
          <h2 id="contact-title" className="contact-title">
            Got a role in mind?
          </h2>
          <p className="contact-lede">{profile.lookingFor} Email is the fastest way to reach me.</p>
          <div className="actions">
            <a className="btn btn-secondary" href={`mailto:${profile.email}`}>
              <Icon name="mail" />
              Email me
            </a>
            <button className="btn btn-secondary" type="button" data-state={copied ? 'done' : undefined} onClick={copy}>
              <Icon name={copied ? 'check' : 'copy'} />
              {copied ? 'Copied' : 'Copy address'}
            </button>
          </div>
          <p className="contact-email">{profile.email}</p>
        </div>
        <ul className="profiles" aria-label="Profiles">
          <li>
            <a className="btn btn-secondary btn-sm" href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="btn btn-secondary btn-sm" href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a className="btn btn-secondary btn-sm" href={links.discord} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </li>
        </ul>
      </div>
      <p className="sr-only" aria-live="polite">
        {copied ? 'Email address copied' : ''}
      </p>
    </section>
  );
}
