// src/app/song.model.ts
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export interface User {
  id: string;
  username: string;
  password: string; // Just to simulate login, not stored in production lulw
  email: string;
  favoriteGenre: string;
  playlists: Playlist[];
}
