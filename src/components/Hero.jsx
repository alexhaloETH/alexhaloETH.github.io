import { links, profile, status } from '../data/profile';
import { DiscordIcon, Icon } from './Icon';
import Window from './Window';
import './Hero.css';

export default function Hero() {
  const { achievement } = status;
  return (
    <div className="wrap intro">
      <section className="card card-raised hero" aria-labelledby="hero-title">
        <p className="badge">{profile.availability}</p>
        <h1 id="hero-title" className="hero-name">
          {profile.handle}
        </h1>
        <p className="statement">{profile.statement}</p>
        <p className="hero-intro">{profile.intro}</p>
        <div className="actions">
          <a className="btn btn-primary" href={`mailto:${profile.email}`}>
            <Icon name="mail" />
            Email me
          </a>
          <a className="btn btn-secondary" href={links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a
            className="btn btn-secondary btn-icon"
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Icon name="github" />
          </a>
          <a
            className="btn btn-secondary btn-icon"
            href={links.discord}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
          >
            <DiscordIcon />
          </a>
        </div>
      </section>

      <Window id="status" title="Status" level={2} className="status-window">
        <dl className="status-list">
          {status.rows.map((row) => (
            <div className="status-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>
                {row.value}
                {row.detail ? <span>{row.detail}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
        <p className="achievement">
          <Icon name="award" className="icon achievement-icon" />
          <span className="achievement-text">
            <strong>{achievement.title}</strong>
            <span>{achievement.detail}</span>
          </span>
        </p>
        <dl className="counters">
          {status.counters.map((counter) => (
            <div className="counter" key={counter.label}>
              <dt>{counter.label}</dt>
              <dd>{counter.value}</dd>
            </div>
          ))}
        </dl>
      </Window>
    </div>
  );
}
