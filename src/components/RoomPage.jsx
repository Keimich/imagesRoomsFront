import React, { useState, useEffect, useCallback, useRef } from 'react'; // Importa useCallback
import { useParams, useLocation, useNavigate } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../socket';
import Image from './Image';

function RoomPage() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const location = useLocation();
  const { userName, userId } = location.state || { userName: 'Anonymous', userId: null };

  const [users, setUsers] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    // The backend needs the userId to correctly identify the user across connections.
    if (!userId) {
      console.error("User ID is missing. Please join from the home page.");
      // Redirect to home page, passing the attempted room ID in state
      navigate('/', { state: { attemptedRoomId: roomId } });
      return;
    }

    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('joinRoom', { roomId, userName, userId });
    });

    socket.on('currentRoomState', (roomState) => {
      setUsers(roomState.users);
      setImages(roomState.images);
    });

    socket.on('userListUpdate', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on('imageAdded', (image) => {
      setImages((prevImages) => {
        if (prevImages.find(i => i.id === image.id)) {
          return prevImages;
        }
        return [...prevImages, image];
      });
    });

    socket.on('imageMoved', ({ imageId, position }) => {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, ...position } : img
        )
      );
    });

    socket.on('imageResized', ({ imageId, size }) => {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, ...size } : img
        )
      );
    });

    socket.on('imageDeleted', ({ imageId }) => {
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, userName, userId]);

  const fileInputRef = useRef(null);

  const addImage = useCallback(() => {
    fileInputRef.current.click(); // Trigger the hidden file input click
  }, []);

  const processAndEmitImageFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
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

        const newImage = {
          id: uuidv4(),
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

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    processAndEmitImageFile(file);
    event.target.value = '';
  }, [processAndEmitImageFile]);

  const moveImage = useCallback((imageId, position) => {
    socket.emit('imageMoved', { roomId, imageId, position });
  }, [roomId]);

  const deleteImage = useCallback((imageId) => {
    socket.emit('imageDeleted', { roomId, imageId });
  }, [roomId]);

  const resizeImage = useCallback((imageId, size) => {
    socket.emit('imageResized', { roomId, imageId, size });
  }, [roomId]);

  const handlePaste = useCallback(async (event) => {
    if (event.clipboardData.files.length > 0) {
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
    <div className="room-container">
      <div className="top-left-info">
        <h1>Room: {roomId}</h1>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>

      {images.map((image) => (
        <Image
          key={image.id}
          image={image}
          onMove={moveImage}
          onDelete={deleteImage}
          onResizeStop={resizeImage}
        />
      ))}

      {/* Hidden file input remains for the FAB */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Floating Action Button */}
      <button onClick={addImage} className="fab">
        +
      </button>
    </div>
  );
}

export default RoomPage;
