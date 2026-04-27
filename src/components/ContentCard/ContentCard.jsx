import { useEffect, useState } from 'react';
import BaseCard from '../BaseCard/BaseCard';
import { getPublishedContent, getPublishedContentMeta } from '../../utils/contentApi';
import './ContentCard.css';

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

function ContentCard() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    Promise.all([
      getPublishedContent(),
      getPublishedContentMeta(),
    ])
      .then(([contentItems, contentMeta]) => {
        if (!active) {
          return;
        }

        setItems(Array.isArray(contentItems) ? contentItems.slice(0, 3) : []);
        setMeta(contentMeta);
        setStatus('ready');
      })
      .catch(() => {
        if (active) {
          setStatus('error');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <BaseCard className="card card-content-dashboard">
      <div className="content-card-shell">
        <div className="content-card-header">
          <div>
            <span className="content-card-kicker">Vault</span>
            <h2>Published Notes</h2>
          </div>
          <a className="content-card-action" href="/content">Open</a>
        </div>

        {status === 'loading' && (
          <div className="content-card-state">Loading...</div>
        )}

        {status === 'error' && (
          <div className="content-card-state error">Content unavailable</div>
        )}

        {status === 'ready' && items.length === 0 && (
          <div className="content-card-empty">
            <strong>No published notes yet</strong>
            <span>{meta?.publishedCount ?? 0} live</span>
          </div>
        )}

        {status === 'ready' && items.length > 0 && (
          <div className="content-card-list">
            {items.map((item) => (
              <a className="content-card-item" href={`/content/${item.slug}`} key={item.slug}>
                <span className="content-card-type">{item.type || 'note'}</span>
                <strong>{item.title}</strong>
                {item.date && <time>{formatDate(item.date)}</time>}
              </a>
            ))}
          </div>
        )}

        <div className="content-card-footer">
          <span>{meta?.publishedCount ?? 0} published</span>
          <a href="/projects">Projects</a>
        </div>
      </div>
    </BaseCard>
  );
}

export default ContentCard;
