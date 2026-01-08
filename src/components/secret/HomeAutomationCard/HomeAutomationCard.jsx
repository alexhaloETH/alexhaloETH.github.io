import { useState } from 'react';
import BaseCard from '../../BaseCard/BaseCard';
import { ROOM_PRESETS } from './HomeAutomationCard.constants';
import EnvironmentControls from './components/EnvironmentControls';
import QuickActions from './components/QuickActions';
import RoomControls from './components/RoomControls';
import SecurityModeSelector from './components/SecurityModeSelector';
import './HomeAutomationCard.css';

function HomeAutomationCard() {
  const [roomStates, setRoomStates] = useState(ROOM_PRESETS);
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
    <BaseCard className="card secret-card home-automation-card">
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
        <QuickActions actions={quickActions} />
        <RoomControls rooms={roomStates} onToggleRoom={toggleRoom} />
        <EnvironmentControls
          brightness={brightness}
          temperature={temperature}
          volume={volume}
          onBrightnessChange={setBrightness}
          onTemperatureChange={setTemperature}
          onVolumeChange={setVolume}
        />
        <SecurityModeSelector
          securityMode={securityMode}
          onChange={setSecurityMode}
        />
      </div>

      <div className="card-footer">
        <span className="status-dot connected" />
        <span>Mock Data - Backend Not Connected</span>
      </div>
    </BaseCard>
  );
}

export default HomeAutomationCard;
