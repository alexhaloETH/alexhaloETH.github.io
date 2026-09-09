const RELATION_LABEL = {
  adjacent: 'layered',
  non_adjacent: 'separate',
  match_or_contrast: 'match or contrast',
};

function PairingsView({ anchor, pairings, isScoring, error }) {
  if (!anchor) {
    return <p className="wardrobe-hint">Pick a garment to see what it goes with.</p>;
  }
  if (isScoring) return <p className="wardrobe-hint">Scoring…</p>;
  if (error) return <p className="wardrobe-error">{error}</p>;
  if (!pairings || pairings.groups.length === 0) {
    return (
      <p className="wardrobe-hint">
        Nothing pairs with {anchor.label} yet. Add garments in other slots, or
        this one may be failing the chroma or lightness rules against everything
        you own.
      </p>
    );
  }

  return (
    <div className="wardrobe-pairings">
      {pairings.groups.map((group) => (
        <section key={group.slot} className="wardrobe-pair-group">
          <h4 className="wardrobe-pair-slot">{group.slot}</h4>
          <ul className="wardrobe-pair-list">
            {group.partners.map((partner) => (
              <li key={partner.id} className="wardrobe-pair-row">
                <span className="wardrobe-swatch" style={{ background: partner.hex }} aria-hidden="true" />
                <span className="wardrobe-pair-label">{partner.label}</span>
                <span className="wardrobe-pair-meta">
                  {RELATION_LABEL[partner.relation] || partner.relation}
                  {partner.hueBonus ? ' · hue bonus' : ''}
                  {partner.penalty > 0 ? ` · −${partner.penalty}` : ''}
                </span>
                <span className="wardrobe-score">{partner.score}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default PairingsView;
