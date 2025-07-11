import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, Observable, of, tap, throwError } from 'rxjs';
import { User, Song } from '../models/song.model'; // Song is now 'string'
import { catchError, map, switchMap } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import {AuthService} from './auth-service';

// Update UserState to reflect that songs are now just strings
export type UserState = {
  songsToPlay: Song[]; // This means string[]
  heroSong: Song | null; // This means string | null
  alreadyPlayedSongs: Song[]; // This means string[]
  loadingSongs: boolean;
  error: string | null; // Consistent error property name
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends RxState<UserState> {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService); // Inject AuthService

  private readonly apiUrl = '/api/users'; // Base API URL for users

  constructor() {
    super();
    // Initialize state with default values
    this.initState();

    // todo connect user state to auth state
  }

  private initState() {
    this.set({
      songsToPlay: [],
      heroSong: null,
      alreadyPlayedSongs: [],
      loadingSongs: false,
      error: null
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves all song names for a specific user.
   * @param userId The ID of the user.
   * @returns An Observable of an array of song names (strings), which is `Song[]`.
   */
  getAllSongsForUser(userId: string): Observable<Song[]> {
    return this.getUserById(userId).pipe(
      map(user => user.songs || []), // Access the 'songs' array directly, which is string[]
      catchError(error => {
        console.error(`Error fetching songs for user ${userId}:`, error);
        return of([]); // Return an empty array on error
      })
    );
  }

  /**
   * Adds a song name to a user's list of songs.
   * @param userId The ID of the user.
   * @param songName The name of the song to add (type Song, which is string).
   * @returns An Observable of the updated User object.
   */
  addUserSong(userId: string, songName: Song): Observable<User> {
    return this.getUserById(userId).pipe(
      switchMap(user => {
        user.songs.push(songName);
        return this.updateUser(user);
      }),
      tap(updatedUser => {
        // Optimistically update the state after successful add
        this.set('songsToPlay', (currentSongs) => [
          ...currentSongs.songsToPlay,
          songName // Add the new song name (string) directly
        ]);
      }),
      catchError(error => {
        console.error(`Error adding song '${songName}' for user ${userId}:`, error);
        return throwError(() => new Error(`Could not add song for user ${userId}`));
      })
    );
  }

  /**
   * Deletes a song name from a user's list of songs.
   * @param userId The ID of the user.
   * @param songName The name of the song to delete (type Song, which is string).
   * @returns An Observable of the updated User object.
   */

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  /**
   * Selects the next song from songsToPlay and moves it to currentSong.
   * Moves currentSong to alreadyPlayedSongs.
   */
  playNextSong(songName?: Song): void {
    const currentState = this.get();
    let nextSong: Song | null = null;
    let remainingSongs: Song[] = [...currentState.songsToPlay]; // Start with a mutable copy

    // First, move the current song (if any) to alreadyPlayedSongs
    const updatedAlreadyPlayed = currentState.heroSong
      ? [...currentState.alreadyPlayedSongs, currentState.heroSong]
      : currentState.alreadyPlayedSongs;

    if (songName) {
      // Case 1: Specific songName is provided
      const index = remainingSongs.indexOf(songName);
      if (index !== -1) {
        nextSong = remainingSongs[index];
        // Remove the picked song from the remaining list
        remainingSongs.splice(index, 1);
      } else {
        console.warn(`Song '${songName}' not found in songsToPlay. Picking a random song instead.`);
        // Fallback to random if the specified song isn't in the list
        if (remainingSongs.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingSongs.length);
          nextSong = remainingSongs[randomIndex];
          remainingSongs.splice(randomIndex, 1);
        }
      }
    } else {
      // Case 2: Pick a random song from the list
      if (remainingSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingSongs.length);
        nextSong = remainingSongs[randomIndex];
        // Remove the picked song from the remaining list
        remainingSongs.splice(randomIndex, 1);
      }
    }

    // Update the state based on the chosen song
    this.set({
      songsToPlay: remainingSongs,
      heroSong: nextSong, // nextSong will be null if no songs are left
      alreadyPlayedSongs: updatedAlreadyPlayed
    });
  }

  /**
   * Resets the playback state, moving all songs back to songsToPlay.
   */
  resetPlayback(): void {
    const currentState = this.get();
    const allSongs = [
      ...currentState.alreadyPlayedSongs,
      ...(currentState.heroSong ? [currentState.heroSong] : []),
      ...currentState.songsToPlay
    ];

    this.set({
      songsToPlay: allSongs,
      heroSong: null,
      alreadyPlayedSongs: []
    });
  }
}
