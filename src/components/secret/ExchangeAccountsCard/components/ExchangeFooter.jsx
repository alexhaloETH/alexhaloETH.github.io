function ExchangeFooter({ connectedCount, totalCount }) {
  return (
    <div className="card-footer">
      <span className={`status-dot ${connectedCount > 0 ? 'connected' : 'warning'}`} />
      <span>{connectedCount} of {totalCount} exchanges connected</span>
    </div>
  );
}

export default ExchangeFooter;
