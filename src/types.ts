export interface User {
  id: string;
  name: string;
}

export interface Image {
  id: string;
  name?: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoomState {
  users: User[];
  images: Image[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}
