import { experience } from '@data/experience';
import { status } from '@data/profile';
import { Icon } from './Icon';
import './Interlude.css';

// The first break in the page: the camera swings to the ship's flank behind this.
export default function Award() {
  const { achievement, counters } = status;
  const uni = experience.find((job) => job.id === 'uwe');
  const dissertation = uni?.points?.find((point) => point.startsWith('First-class'));

  return (
    <section className="interlude interlude-award" data-shot="award" aria-labelledby="award-title">
      <div className="wrap interlude-inner">
        <p className="label label-accent">
          <Icon name="award" />
          Award
        </p>
        <h2 id="award-title" className="statement">
          {achievement.title}
        </h2>
        <p className="interlude-text">
          {achievement.detail}. {dissertation}
        </p>
        <dl className="counters">
          {counters.map((counter) => (
            <div className="counter" key={counter.label}>
              <dt className="label">{counter.label}</dt>
              <dd>{counter.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
