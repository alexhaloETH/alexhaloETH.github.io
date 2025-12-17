import BaseCard from '../../BaseCard/BaseCard';
import './HomeAutomationCard.css';

// Mock data - will be replaced with API calls
const rooms = [
  { id: 1, name: 'Living Room', isOn: false },
  { id: 2, name: 'Bedroom', isOn: true },
  { id: 3, name: 'Kitchen', isOn: false },
  { id: 4, name: 'Office', isOn: true },
];

function HomeAutomationCard() {
  return (
    <BaseCard className="card home-automation-card">
      <div className="card-header">
        <div className="card-icon home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        </div>
        <h3>Home Automation</h3>
      </div>

      <div className="card-content">
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-item">
              <span className="room-name">{room.name}</span>
              <div className={`toggle ${room.isOn ? 'on' : 'off'}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <span className="status-dot connected" />
        <span>Mock Data - Backend Not Connected</span>
      </div>
    </BaseCard>
  );
}

export default HomeAutomationCard;
