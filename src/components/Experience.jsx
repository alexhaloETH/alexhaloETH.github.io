import { experience } from '@data/experience';
import './Experience.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatMonth(value) {
  const [year, month] = value.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

export default function Experience() {
  return (
    <section id="experience" className="sheet sheet-top" aria-labelledby="experience-title">
      <div className="wrap record">
        <h2 id="experience-title" className="section-title">
          Experience
        </h2>
        <ol className="timeline">
          {experience.map((job) => (
            <li className={job.latest ? 'entry entry-latest' : 'entry'} key={job.id}>
              <p className="entry-when label">
                <time dateTime={job.start}>{formatMonth(job.start)}</time>
                {' to '}
                {job.end ? <time dateTime={job.end}>{formatMonth(job.end)}</time> : 'now'}
              </p>
              <div className="entry-body">
                <h3 className="entry-role">{job.role}</h3>
                <p className="entry-org">{job.org}</p>
                <p className="entry-summary">{job.summary}</p>
                {job.points ? (
                  <ul className="ticks">
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
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
