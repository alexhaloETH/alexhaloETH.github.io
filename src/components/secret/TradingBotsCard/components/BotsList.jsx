import { formatMoney, formatPercentage } from '../../../../utils/privacy';

function BotsList({ bots, selectedPeriod, showPercentage, isPrivate }) {
  return (
    <div className="bots-grid">
      {bots.map((bot) => {
        const stats = bot.stats[selectedPeriod];
        const changeType = stats.change > 0 ? 'positive' : stats.change < 0 ? 'negative' : 'neutral';

        return (
          <div key={bot.id} className="bot-item">
            <div className="bot-info">
              <span className="bot-name">{bot.name}</span>
              <span className={`bot-status ${bot.status}`}>{bot.status}</span>
            </div>
            <div className="bot-stats">
              <span className={`stat ${changeType}`}>
                {showPercentage
                  ? formatPercentage(stats.change, isPrivate)
                  : formatMoney(stats.profit, isPrivate)
                }
              </span>
              <span className="stat-label">{selectedPeriod}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BotsList;
