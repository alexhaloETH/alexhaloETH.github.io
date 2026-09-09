import { useState } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import { useAuth } from '../../../contexts/AuthContext';
import useWardrobeData from './useWardrobeData';
import ItemFormModal from './components/ItemFormModal';
import PairingsView from './components/PairingsView';
import OutfitsView from './components/OutfitsView';
import './WardrobeCard.css';

const TABS = [
  ['items', 'Wardrobe'],
  ['pairings', 'Goes with'],
  ['outfits', 'Outfits'],
];

function WardrobeCard() {
  const { canRead, canWrite } = useAuth();
  const canReadWardrobe = canRead('wardrobe');
  const canWriteWardrobe = canWrite('wardrobe');

  const [tab, setTab] = useState('items');
  const [editing, setEditing] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    itemsBySlot, stats, isLoading, error, refresh,
    anchor, anchorId, selectAnchor,
    pairings, outfits, isScoring, scoringError,
    saveItem, removeItem,
  } = useWardrobeData(canReadWardrobe);

  const openNew = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (item) => { setEditing(item); setIsFormOpen(true); };

  const subtitle = stats.total === 0
    ? 'Colour pairing across what you own'
    : `${stats.total} item${stats.total === 1 ? '' : 's'} · ${stats.active} in rotation · ${stats.slots} slots`;

  return (
    <BaseCard className="card secret-card wardrobe-card">
      <div className="card-header wardrobe-card-header">
        <div className="wardrobe-title-block">
          <div className="card-icon wardrobe">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v5" />
              <path d="M12 8 5 12v8h14v-8Z" />
              <path d="M9 3a3 3 0 0 0 6 0" />
            </svg>
          </div>
          <div>
            <h3>Wardrobe</h3>
            <p className="wardrobe-subtitle">{subtitle}</p>
          </div>
        </div>
        {canWriteWardrobe && (
          <button type="button" className="wardrobe-btn primary" onClick={openNew}>
            Add garment
          </button>
        )}
      </div>

      <div className="wardrobe-tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`wardrobe-tab ${tab === key ? 'active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {anchor && tab !== 'items' && (
        <p className="wardrobe-anchor">
          Around <span className="wardrobe-swatch" style={{ background: anchor.hex }} aria-hidden="true" />
          <strong>{anchor.label}</strong>
        </p>
      )}

      <div className="wardrobe-body">
        {!canReadWardrobe && <p className="wardrobe-hint">You do not have access to the wardrobe.</p>}

        {canReadWardrobe && tab === 'items' && (
          <>
            {isLoading && <p className="wardrobe-hint">Loading…</p>}
            {error && (
              <p className="wardrobe-error">
                {error} <button type="button" className="wardrobe-btn" onClick={refresh}>Retry</button>
              </p>
            )}
            {!isLoading && !error && itemsBySlot.length === 0 && (
              <p className="wardrobe-hint">
                Nothing here yet. Add a garment and its hue, lightness and chroma
                are derived from the hex when it saves.
              </p>
            )}
            {itemsBySlot.map(([slot, list]) => (
              <section key={slot} className="wardrobe-slot">
                <h4 className="wardrobe-slot-title">{slot}</h4>
                <ul className="wardrobe-items">
                  {list.map((item) => (
                    <li key={item.id} className={`wardrobe-item ${item.isActive ? '' : 'inactive'}`}>
                      <button
                        type="button"
                        className={`wardrobe-item-main ${anchorId === item.id ? 'anchored' : ''}`}
                        onClick={() => selectAnchor(anchorId === item.id ? null : item.id)}
                        title="Score everything against this garment"
                      >
                        <span className="wardrobe-swatch" style={{ background: item.hex }} aria-hidden="true" />
                        <span className="wardrobe-item-label">{item.label}</span>
                        <span className="wardrobe-item-meta">{item.hex}{item.isActive ? '' : ' · out'}</span>
                      </button>
                      {canWriteWardrobe && (
                        <span className="wardrobe-item-actions">
                          <button type="button" className="wardrobe-btn" onClick={() => openEdit(item)}>Edit</button>
                          <button type="button" className="wardrobe-btn danger" onClick={() => removeItem(item.id)}>Remove</button>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}

        {canReadWardrobe && tab === 'pairings' && (
          <PairingsView anchor={anchor} pairings={pairings} isScoring={isScoring} error={scoringError} />
        )}

        {canReadWardrobe && tab === 'outfits' && (
          <OutfitsView anchor={anchor} outfits={outfits} isScoring={isScoring} error={scoringError} />
        )}
      </div>

      {isFormOpen && (
        <ItemFormModal item={editing} onSave={saveItem} onClose={() => setIsFormOpen(false)} />
      )}
    </BaseCard>
  );
}

export default WardrobeCard;
