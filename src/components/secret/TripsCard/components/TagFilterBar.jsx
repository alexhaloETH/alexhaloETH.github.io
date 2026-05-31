// Multi-select tag chips. Filtering uses OR semantics: a trip shows if it
// carries ANY of the selected tags. Empty selection = show everything.
function TagFilterBar({ tags, selected, onToggle, onClear }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="trips-tag-filter">
      <span className="trips-tag-filter-label">Filter</span>
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            className={active ? 'trips-tag-chip is-active' : 'trips-tag-chip'}
            onClick={() => onToggle(tag)}
            aria-pressed={active}
          >
            {tag}
          </button>
        );
      })}
      {selected.length > 0 && (
        <button type="button" className="trips-tag-clear" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}

export default TagFilterBar;
