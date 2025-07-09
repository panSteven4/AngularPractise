// src/app/song.model.ts

export type Song = string;

export interface User {
  id: string;
  username: string;
  password: string; // Just to simulate login, not stored in production lulw
  email: string;
  favoriteGenre: string;
  songs: Song[];
}
