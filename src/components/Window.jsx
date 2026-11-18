// A game UI window: an ink title bar over a cream panel. Used for the Status
// sheet, the Inventory bags and the world map.
export default function Window({ id, title, meta, level = 3, className = '', style, children }) {
  const Heading = `h${level}`;
  const titleId = `${id}-title`;
  return (
    <div className={`window ${className}`.trim()} style={style} role="group" aria-labelledby={titleId}>
      <div className="window-bar">
        <Heading className="window-title" id={titleId}>
          {title}
        </Heading>
        {meta ? <span className="window-meta">{meta}</span> : null}
      </div>
      <div className="window-body">{children}</div>
    </div>
  );
}
