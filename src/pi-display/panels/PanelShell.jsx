function PanelShell({
  eyebrow,
  title,
  tone = 'neutral',
  children,
}) {
  return (
    <article className={`pi-panel pi-panel-${tone}`}>
      <div className="pi-panel-heading">
        {eyebrow && <span>{eyebrow}</span>}
        <h1>{title}</h1>
      </div>
      <div className="pi-panel-body">
        {children}
      </div>
    </article>
  );
}

export default PanelShell;
