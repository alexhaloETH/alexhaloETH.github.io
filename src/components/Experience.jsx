import { experience } from '../data/experience';
import { PixelArrow } from './Icon';
import './Experience.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(value) {
  const [year, month] = value.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

export default function Experience() {
  return (
    <section id="experience" className="section wrap" aria-labelledby="experience-title">
      <h2 id="experience-title" className="section-title">
        <PixelArrow />
        Experience
      </h2>
      <ol className="path">
        {experience.map((job) => (
          <li className={job.latest ? 'step step-latest' : 'step'} key={job.id}>
            <p className="when">
              <time dateTime={job.start}>{formatMonth(job.start)}</time>
              {' to '}
              {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : 'now'}
            </p>
            <h3 className="role">{job.role}</h3>
            <p className="org">{job.org}</p>
            <p className="summary">{job.summary}</p>
            {job.points ? (
              <ul className="checks">
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : null}
            {job.link ? (
              <a className="link" href={job.link.href}>
                {job.link.label}
              </a>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
