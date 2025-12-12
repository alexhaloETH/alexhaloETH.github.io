import BaseCard from '../BaseCard/BaseCard';
import { socialLinks, heroData } from '../../data/social';
import './HeroCard.css';

function HeroCard() {
  return (
    <BaseCard className="card card-hero" variant="no-padding">
      <div className="hero-bg"></div>
      <div className="hero-bg-overlay"></div>
      <div className="hero-content">
        <div className="hero-main">
          <div className="hero-text">
            <h1 className="hero-name">{heroData.name}</h1>
            <p className="hero-subtitle">
              {heroData.subtitle} <br /> {heroData.subtitleLine2}
            </p>
            <p className="hero-bio">
              {heroData.bio.prefix}
              <span className="highlight">{heroData.bio.highlight}</span>
              {heroData.bio.suffix}
            </p>
          </div>
          <div className="social-links">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="social-link"
                {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d={link.icon} />
                </svg>
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="hero-footer">
          <div className="hero-current">
            <span className="current-label">Currently working on/at</span>
            <span className="current-project">{heroData.currentProject}</span>
          </div>
          <div className="hero-jams">
            <span className="jams-count">{heroData.gameJamsCount}</span>
            <span className="jams-label">{heroData.gameJamsLabel}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

export default HeroCard;
