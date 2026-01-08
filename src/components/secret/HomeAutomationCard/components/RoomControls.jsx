function RoomControls({ rooms, onToggleRoom }) {
  return (
    <div className="automation-section">
      <h4 className="section-label">Room Controls</h4>
      <div className="rooms-grid">
        {rooms.map((room) => (
          <div key={room.id} className="room-item">
            <span className="room-name">{room.name}</span>
            <div
              className={`toggle ${room.isOn ? 'on' : 'off'}`}
              onClick={() => onToggleRoom(room.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoomControls;
