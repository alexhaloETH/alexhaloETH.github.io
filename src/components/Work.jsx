import { dungeonForge, earlierWork, featured } from '../data/projects';
import DemoVideo from './DemoVideo';
import { Icon, PixelArrow } from './Icon';
import './Work.css';

// Class names are spelled out in full so a search for a class finds its use.
const SHOT_CLASS = { main: 'shot shot-main', side: 'shot shot-side', phone: 'shot shot-phone' };

export default function Work() {
  return (
    <section id="work" className="section wrap" aria-labelledby="work-title">
      <h2 id="work-title" className="section-title">
        <PixelArrow />
        Selected work
      </h2>

      <article className="card card-raised project project-lead" aria-labelledby="blob-arena-title">
        <div className="shots">
          {featured.media.map((shot) => (
            <figure className={SHOT_CLASS[shot.kind]} key={shot.src}>
              <img
                src={shot.src}
                width={shot.width}
                height={shot.height}
                alt={shot.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
        <div className="project-body">
          <p className="chips">
            <span className="chip">
              <Icon name="shipped" />
              {featured.status}
            </span>
            <span className="chip chip-muted">{featured.period}</span>
          </p>
          <h3 id="blob-arena-title" className="project-title">
            {featured.title}
          </h3>
          <p className="project-role">{featured.role}</p>
          <p className="project-text">{featured.summary}</p>
          <h4 className="label">What I did</h4>
          <ul className="checks">
            {featured.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ul className="chips project-stack" aria-label="Stack">
            {featured.stack.map((tech) => (
              <li className="chip" key={tech}>
                {tech}
              </li>
            ))}
          </ul>
          <a className="btn btn-secondary project-link" href={featured.link.href} target="_blank" rel="noopener noreferrer">
            {featured.link.label}
            <Icon name="arrowUpRight" />
          </a>
        </div>
      </article>

      <article className="card project project-second" aria-labelledby="dungeon-forge-title">
        <DemoVideo id="dungeon-forge-video" video={dungeonForge.video} />
        <div className="project-body">
          <p className="chips">
            <span className="chip">
              <Icon name="fork" />
              {dungeonForge.status}
            </span>
            <span className="chip chip-muted">{dungeonForge.period}</span>
          </p>
          <h3 id="dungeon-forge-title" className="project-title">
            {dungeonForge.title}
          </h3>
          <p className="project-role">{dungeonForge.role}</p>
          {dungeonForge.paragraphs.map((text) => (
            <p className="project-text" key={text.slice(0, 32)}>
              {text}
            </p>
          ))}
          <a className="btn btn-secondary project-link" href={dungeonForge.link.href} target="_blank" rel="noopener noreferrer">
            {dungeonForge.link.label}
            <Icon name="arrowUpRight" />
          </a>
        </div>
      </article>

      <div className="shelf">
        <h3 className="shelf-title">Earlier work on GitHub</h3>
        <ul>
          {earlierWork.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <span className="shelf-name">{item.name}</span>
                <span className="shelf-meta">{item.meta}</span>
                <Icon name="arrowUpRight" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
