import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getPersistentUserId, generateRandomName } from '../utils/user';

function HomePage() {
  const [userName, setUserName] = useState(() => generateRandomName());
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the user was redirected from a room page, pre-fill the room ID.
    if (location.state?.attemptedRoomId) {
      setRoomId(location.state.attemptedRoomId);
    }
  }, [location.state]);

  const handleNavigateToRoom = (targetRoomId) => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    const userId = getPersistentUserId(); // Get or create persistent user ID
    navigate(`/room/${targetRoomId}`, { state: { userName, userId } });
  };

  const createRoom = async () => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/rooms', {
        method: 'POST',
      });
      const data = await response.json();
      handleNavigateToRoom(data.roomId);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = () => {
    if (!userName || !roomId) {
      alert('Please enter your name and a room ID');
      return;
    }
    handleNavigateToRoom(roomId);
  };

  return (
    <div>
      <h1>ImgsRooms</h1>
      <p>Real-time collaborative image boards.</p>
      <div>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <button onClick={createRoom}>Create Room</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default HomePage;