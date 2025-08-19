import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '@/socket';
import Image from '@/components/Image';
import UserList from '@/components/UserList';
import { User, Image as ImageType, RoomState, Position, Size } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function RoomPage(): React.ReactElement {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const { userName, userId } = location.state || { userName: 'Anonymous', userId: null };

  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing. Please join from the home page.");
      navigate('/', { state: { attemptedRoomId: roomId } });
      return;
    }

    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('joinRoom', { roomId, userName, userId });
    });

    socket.on('currentRoomState', (roomState: RoomState) => {
      setUsers(roomState.users);
      setImages(roomState.images);
    });

    socket.on('userListUpdate', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on('imageAdded', (image: ImageType) => {
      setImages((prevImages) => {
        if (prevImages.find(i => i.id === image.id)) {
          return prevImages;
        }
        return [...prevImages, image];
      });
    });

    socket.on('imageMoved', ({ imageId, position }: { imageId: string; position: Position }) => {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, ...position } : img
        )
      );
    });

    socket.on('imageResized', ({ imageId, size }: { imageId: string; size: Size }) => {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, ...size } : img
        )
      );
    });

    socket.on('imageDeleted', ({ imageId }: { imageId: string }) => {
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userName, userId, navigate]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const processAndEmitImageFile = useCallback((file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const imageElement = new window.Image();
      imageElement.onload = () => {
        const { naturalWidth, naturalHeight } = imageElement;
        const maxWidth = 500;
        const maxHeight = 500;
        let width = naturalWidth;
        let height = naturalHeight;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        const newImage: ImageType = {
          id: uuidv4(),
          name: file.name,
          url: dataUrl,
          x: Math.round((window.innerWidth - width) / 2),
          y: Math.round((window.innerHeight - height) / 2),
          width: Math.round(width),
          height: Math.round(height),
        };
        socket.emit('imageAdded', { roomId, image: newImage });
      };
      imageElement.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [roomId]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processAndEmitImageFile(file);
    }
    event.target.value = '';
  }, [processAndEmitImageFile]);

  const moveImage = useCallback((imageId: string, position: Position) => {
    socket.emit('imageMoved', { roomId, imageId, position });
  }, [roomId]);

  const deleteImage = useCallback((imageId: string) => {
    socket.emit('imageDeleted', { roomId, imageId });
  }, [roomId]);

  const resizeImage = useCallback((imageId: string, size: Size) => {
    socket.emit('imageResized', { roomId, imageId, size });
  }, [roomId]);

  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    if (event.clipboardData?.files.length) {
      const file = event.clipboardData.files[0];
      event.preventDefault();
      processAndEmitImageFile(file);
    }
  }, [processAndEmitImageFile]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <TooltipProvider>
      <div className="w-screen h-screen relative overflow-hidden">
        <div className="absolute w-full p-4 z-50 flex items-center justify-between">
          <Card className="p-4">
            <CardTitle className="whitespace-nowrap">Room: {roomId}</CardTitle>
          </Card>
          <ModeToggle />
        </div>

        <UserList users={users} />

        {images.map((image) => (
          <Image
            key={image.id}
            image={image}
            onMove={moveImage}
            onDelete={deleteImage}
            onResizeStop={resizeImage}
          />
        ))}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-8 right-8 shadow-lg z-50"
              onClick={addImage}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Image</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default RoomPage;
