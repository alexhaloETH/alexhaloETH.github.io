import { featured } from '@data/projects';
import { profile, status } from '@data/profile';
import './Interlude.css';
import './Hero.css';

export default function Hero() {
  const base = status.rows.find((row) => row.label === 'Base');
  const guild = status.rows.find((row) => row.label === 'Last guild');

  const readouts = [
    { label: 'Last role', value: `CTO and co-founder, ${guild.value}`, detail: '2023 to 2026' },
    { label: 'Shipped', value: featured.title, detail: featured.period },
    { label: 'Based in', value: base.value, detail: profile.relocation },
  ];

  return (
    <section className="hero" id="top" data-shot="hero" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <p className="label hero-eyebrow">Game developer, {base.value}</p>
        <h1 id="hero-title" className="hero-name">
          {profile.handle}
        </h1>
        <p className="hero-statement">{profile.statement}</p>
        <div className="actions">
          <a className="btn btn-primary" href="#work">
            See the work
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in touch
          </a>
        </div>
        <p className="availability">
          <span className="pulse" aria-hidden="true" />
          {profile.availability}
        </p>
      </div>

      <dl className="wrap readouts">
        {readouts.map((item) => (
          <div className="readout" key={item.label}>
            <dt className="label">{item.label}</dt>
            <dd>
              <span className="readout-value">{item.value}</span>
              <span className="readout-detail">{item.detail}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
