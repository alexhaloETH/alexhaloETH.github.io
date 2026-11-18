import { inventory, levelingUp } from '../data/skills';
import { BrandIcon, PixelArrow, PixelIcon } from './Icon';
import Window from './Window';
import './Inventory.css';

export default function Inventory() {
  return (
    <section id="toolkit" className="section wrap" aria-labelledby="toolkit-title">
      <h2 id="toolkit-title" className="section-title">
        <PixelArrow />
        Inventory
      </h2>
      <div className="inventory">
        {/* Each bag grows with its item count (see Inventory.css), so slots match in size. */}
        <div className="bags">
          {inventory.map((bag) => (
            <Window
              key={bag.id}
              id={bag.id}
              title={bag.title}
              meta={`${bag.items.length} items`}
              className="bag"
              style={{ '--items': bag.items.length }}
            >
              <ul className="slots">
                {bag.items.map((item) => (
                  <li className="slot" key={item.name}>
                    {item.icon ? (
                      <BrandIcon name={item.icon} className="slot-icon" />
                    ) : (
                      <span className="slot-mono" aria-hidden="true">
                        {item.mono}
                      </span>
                    )}
                    <span className="slot-name">{item.name}</span>
                  </li>
                ))}
              </ul>
            </Window>
          ))}
        </div>

        <Window id="leveling" title={levelingUp.title} className="leveling">
          <p className="leveling-intro">{levelingUp.intro}</p>
          <ul className="perks">
            {levelingUp.items.map((perk) => (
              <li className="perk" key={perk.id}>
                {perk.icon ? (
                  <BrandIcon name={perk.icon} className="perk-icon" />
                ) : (
                  <PixelIcon name={perk.pixels} className="perk-icon" />
                )}
                <span className="perk-text">
                  <strong>{perk.title}</strong>
                  <span>{perk.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </Window>
      </div>
    </section>
  );
}
