import { io, Socket } from 'socket.io-client';
import API_URL from './config';
import { RoomState, User, Image as ImageType, Position, Size } from './types';

// Define the types for the events
interface ServerToClientEvents {
  currentRoomState: (roomState: RoomState) => void;
  userListUpdate: (updatedUsers: User[]) => void;
  imageAdded: (image: ImageType) => void;
  imageMoved: (data: { imageId: string; position: Position }) => void;
  imageResized: (data: { imageId: string; size: Size }) => void;
  imageDeleted: (data: { imageId: string }) => void;
  connect: () => void;
}

interface ClientToServerEvents {
  joinRoom: (data: { roomId: string | undefined; userName: string; userId: string }) => void;
  imageAdded: (data: { roomId: string | undefined; image: ImageType }) => void;
  imageMoved: (data: { roomId: string | undefined; imageId: string; position: Position }) => void;
  imageResized: (data: { roomId: string | undefined; imageId: string; size: Size }) => void;
  imageDeleted: (data: { roomId: string | undefined; imageId: string }) => void;
}

// Create the socket with types
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, {
  autoConnect: false,
});