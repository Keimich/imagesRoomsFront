import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getPersistentUserId, generateRandomName } from '@/utils/user';
import API_URL from '@/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';

function HomePage(): React.ReactElement {
  const [userName, setUserName] = useState<string>(() => generateRandomName());
  const [roomId, setRoomId] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.attemptedRoomId) {
      setRoomId(location.state.attemptedRoomId);
    }
  }, [location.state]);

  const handleNavigateToRoom = (targetRoomId: string) => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    const userId = getPersistentUserId();
    navigate(`/room/${targetRoomId}`, { state: { userName, userId } });
  };

  const createRoom = async () => {
    if (!userName) {
      alert('Please enter your name');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/rooms`, {
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
    <>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">ImgsRooms</CardTitle>
            <CardDescription>Real-time collaborative image boards.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button onClick={createRoom} className="w-full">Create Room</Button>
          </CardContent>
          <CardFooter className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Button onClick={joinRoom} variant="secondary">Join Room</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default HomePage;
