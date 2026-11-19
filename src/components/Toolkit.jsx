import { inventory, levelingUp } from '@data/skills';
import { BrandIcon, Icon } from './Icon';
import './Toolkit.css';

function Mark({ item }) {
  if (item.icon) return <BrandIcon name={item.icon} />;
  if (item.pixels) return <Icon name={item.pixels} />;
  return (
    <span className="monogram" aria-hidden="true">
      {item.mono}
    </span>
  );
}

export default function Toolkit() {
  const count = inventory.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <section id="toolkit" className="sheet sheet-bottom" aria-labelledby="toolkit-title">
      <div className="wrap">
        <header className="section-head toolkit-head">
          <h2 id="toolkit-title" className="section-title">
            Toolkit
          </h2>
          <p className="label">
            {count} tools across {inventory.length} areas
          </p>
        </header>

        <div className="loadout">
          {inventory.map((group) => (
            <div className="group" key={group.id}>
              <h3 className="label group-title">{group.title}</h3>
              <ul className="group-list">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Mark item={item} />
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="leveling">
          <div className="leveling-head">
            <h3 id="leveling-title" className="leveling-title">
              {levelingUp.title}
            </h3>
            <p className="leveling-intro">{levelingUp.intro}</p>
          </div>
          <ul className="leveling-list">
            {levelingUp.items.map((item) => (
              <li className="perk" key={item.id}>
                <span className="perk-mark">
                  <Mark item={item} />
                </span>
                <span className="perk-text">
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
