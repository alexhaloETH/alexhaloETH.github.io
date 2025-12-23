import { useState } from 'react';
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
  const [roomStates, setRoomStates] = useState(rooms);
  const [brightness, setBrightness] = useState(75);
  const [temperature, setTemperature] = useState(22);
  const [volume, setVolume] = useState(50);
  const [securityMode, setSecurityMode] = useState('home');

  const toggleRoom = (roomId) => {
    setRoomStates((prev) =>
      prev.map((room) =>
        room.id === roomId ? { ...room, isOn: !room.isOn } : room
      )
    );
  };

  const quickActions = [
    {
      id: 1,
      name: 'All Lights Off',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      ),
      action: () => setRoomStates((prev) => prev.map((room) => ({ ...room, isOn: false }))),
    },
    {
      id: 2,
      name: 'All Lights On',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ),
      action: () => setRoomStates((prev) => prev.map((room) => ({ ...room, isOn: true }))),
    },
    {
      id: 3,
      name: 'Night Mode',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      action: () => {
        setRoomStates((prev) => prev.map((room) => ({ ...room, isOn: false })));
        setBrightness(20);
        setSecurityMode('away');
      },
    },
    {
      id: 4,
      name: 'Movie Mode',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
          <polyline points="17,2 12,7 7,2" />
        </svg>
      ),
      action: () => {
        setBrightness(30);
        setVolume(70);
      },
    },
  ];

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
        {/* Quick Actions Section */}
        <div className="automation-section">
          <h4 className="section-label">Quick Actions</h4>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <button
                key={action.id}
                className="action-btn"
                onClick={action.action}
              >
                {action.icon}
                <span>{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Room Switches Section */}
        <div className="automation-section">
          <h4 className="section-label">Room Controls</h4>
          <div className="rooms-grid">
            {roomStates.map((room) => (
              <div key={room.id} className="room-item">
                <span className="room-name">{room.name}</span>
                <div
                  className={`toggle ${room.isOn ? 'on' : 'off'}`}
                  onClick={() => toggleRoom(room.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sliders Section */}
        <div className="automation-section">
          <h4 className="section-label">Environment</h4>
          <div className="controls-list">
            {/* Brightness Slider */}
            <div className="control-item">
              <div className="control-header">
                <div className="control-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                  </svg>
                  <span className="control-name">Brightness</span>
                </div>
                <span className="control-value">{brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="slider"
              />
            </div>

            {/* Temperature Slider */}
            <div className="control-item">
              <div className="control-header">
                <div className="control-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                  </svg>
                  <span className="control-name">Temperature</span>
                </div>
                <span className="control-value">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="16"
                max="30"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="slider temperature"
              />
            </div>

            {/* Volume Slider */}
            <div className="control-item">
              <div className="control-header">
                <div className="control-info">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span className="control-name">Volume</span>
                </div>
                <span className="control-value">{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>

        {/* Security Mode Selector */}
        <div className="automation-section">
          <h4 className="section-label">Security Mode</h4>
          <div className="mode-selector">
            <button
              className={`mode-btn ${securityMode === 'home' ? 'active' : ''}`}
              onClick={() => setSecurityMode('home')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>Home</span>
            </button>
            <button
              className={`mode-btn ${securityMode === 'away' ? 'active' : ''}`}
              onClick={() => setSecurityMode('away')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Away</span>
            </button>
            <button
              className={`mode-btn ${securityMode === 'sleep' ? 'active' : ''}`}
              onClick={() => setSecurityMode('sleep')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Sleep</span>
            </button>
          </div>
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
