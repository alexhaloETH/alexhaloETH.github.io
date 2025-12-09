import BaseCard from './BaseCard/BaseCard';
import './HeroCard.css';

function HeroCard() {
  return (
    <BaseCard className="card card-hero" variant="no-padding">
      <div className="hero-bg"></div>
      <div className="hero-bg-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-name">Alex Halo</h1>
        <p className="hero-subtitle">Blockchain Developer & Web3 Enthusiast</p>
        <p className="hero-description">
          Building decentralized applications and exploring the future of the web
        </p>
      </div>
    </BaseCard>
  );
}

export default HeroCard;
