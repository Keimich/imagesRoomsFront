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
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-800 text-white p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-bold mb-2">ImgsRooms</h1>
        <p className="text-lg text-neutral-400 mb-8">Real-time collaborative image boards.</p>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <button 
            onClick={createRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Create Room
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="flex-grow px-4 py-2 bg-neutral-700 border border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={joinRoom}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;