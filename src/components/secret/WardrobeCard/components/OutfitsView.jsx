const LAYERS = [
  ['base', 'base'],
  ['mid', 'mid'],
  ['outer', 'outer'],
  ['trousers', 'trousers'],
  ['shoes', 'shoes'],
  ['hat', 'hat'],
];

function OutfitsView({ anchor, outfits, isScoring, error }) {
  if (!anchor) {
    return <p className="wardrobe-hint">Pick a garment to build outfits around it.</p>;
  }
  if (isScoring) return <p className="wardrobe-hint">Building outfits…</p>;
  if (error) return <p className="wardrobe-error">{error}</p>;
  if (!outfits || outfits.outfits.length === 0) {
    return (
      <p className="wardrobe-hint">
        No complete outfit works around {anchor.label} yet. An outfit needs a
        base, trousers and shoes that all pass, plus at least 30 points of
        lightness spread across what is actually visible.
      </p>
    );
  }

  return (
    <ul className="wardrobe-outfits">
      {outfits.outfits.map((outfit, index) => (
        <li key={`${outfit.score}-${index}`} className="wardrobe-outfit">
          <div className="wardrobe-outfit-head">
            <span className="wardrobe-score">{outfit.score}</span>
            <span className="wardrobe-outfit-meta">
              spread {outfit.valueSpread}
              {outfit.hueFamilies.length > 0 ? ` · ${outfit.hueFamilies.join(' + ')}` : ' · neutral'}
            </span>
          </div>
          <div className="wardrobe-outfit-items">
            {LAYERS.map(([key, label]) => {
              const garment = outfit[key];
              if (!garment) return null;
              return (
                <span key={key} className="wardrobe-outfit-item" title={`${label}: ${garment.label}`}>
                  <span className="wardrobe-swatch" style={{ background: garment.hex }} aria-hidden="true" />
                  {garment.label}
                </span>
              );
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default OutfitsView;
