import { dungeonForge, earlierWork, featured } from '@data/projects';
import { profile } from '@data/profile';
import DemoVideo from './DemoVideo';
import { Icon } from './Icon';
import './Work.css';

function mediaOf(kind) {
  return featured.media.find((item) => item.kind === kind);
}

function Frame({ item, className, eager = false }) {
  return (
    <figure className={`frame ${className}`}>
      <img
        src={item.src}
        width={item.width}
        height={item.height}
        alt={item.alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </figure>
  );
}

export default function Work() {
  const main = mediaOf('main');
  const side = mediaOf('side');
  const phone = mediaOf('phone');

  return (
    <section id="work" className="sheet" aria-labelledby="work-title">
      <div className="wrap">
        <header className="section-head">
          <h2 id="work-title" className="section-title">
            Selected work
          </h2>
          <p className="section-lede">{profile.intro}</p>
        </header>

        <article className="feature" aria-labelledby="blob-arena-title">
          <div className="feature-media">
            <Frame item={main} className="frame-main" />
            <div className="frame-row">
              <Frame item={side} className="frame-side" />
              <Frame item={phone} className="frame-phone" />
            </div>
          </div>

          <div className="feature-body">
            <p className="meta">
              <span className="chip">
                <Icon name="check" />
                {featured.status}
              </span>
              <span className="label">{featured.period}</span>
            </p>
            <h3 id="blob-arena-title" className="feature-title">
              {featured.title}
            </h3>
            <p className="feature-role">{featured.role}</p>
            <p>{featured.summary}</p>
            <h4 className="label">What I did</h4>
            <ul className="ticks">
              {featured.highlights.map((item) => (
                <li key={item.slice(0, 32)}>{item}</li>
              ))}
            </ul>
            <ul className="tags" aria-label="Stack">
              {featured.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a className="btn btn-ghost" href={featured.link.href} target="_blank" rel="noopener noreferrer">
              {featured.link.label}
              <Icon name="arrowUpRight" />
            </a>
          </div>
        </article>

        <article className="feature feature-alt" aria-labelledby="dungeon-forge-title">
          <div className="feature-body">
            <p className="meta">
              <span className="chip chip-quiet">{dungeonForge.status}</span>
              <span className="label">{dungeonForge.period}</span>
            </p>
            <h3 id="dungeon-forge-title" className="feature-title">
              {dungeonForge.title}
            </h3>
            <p className="feature-role">{dungeonForge.role}</p>
            {dungeonForge.paragraphs.map((text) => (
              <p key={text.slice(0, 32)}>{text}</p>
            ))}
            <a className="btn btn-ghost" href={dungeonForge.link.href} target="_blank" rel="noopener noreferrer">
              {dungeonForge.link.label}
              <Icon name="arrowUpRight" />
            </a>
          </div>
          <DemoVideo id="dungeon-forge-demo" video={dungeonForge.video} />
        </article>

        <div className="earlier">
          <h3 className="label">Earlier work on GitHub</h3>
          <ul className="earlier-list">
            {earlierWork.map((item) => (
              <li key={item.name}>
                <a className="earlier-link" href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="earlier-name">{item.name}</span>
                  <span className="earlier-meta">{item.meta}</span>
                  <Icon name="arrowUpRight" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
