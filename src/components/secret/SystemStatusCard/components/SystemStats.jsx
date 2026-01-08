function SystemStats({ systemStats, connectedIps }) {
  return (
    <>
      <div className="system-stats">
        {systemStats.map((stat) => (
          <div key={stat.id} className="system-stat">
            <span className="stat-name">{stat.name}</span>
            <div className={'stat-bar ' + stat.type}>
              <div className="stat-fill" style={{ width: stat.percentage + '%' }} />
            </div>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
      {connectedIps.length > 0 && (
        <div className="connected-ips">
          <h4 className="ips-title">Recent Connections</h4>
          <div className="ips-list">
            {connectedIps.map((ip, index) => (
              <div key={index} className="ip-item">
                <span className="ip-dot" />
                <span className="ip-address">{ip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default SystemStats;
