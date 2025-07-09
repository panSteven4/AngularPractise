// src/app/user.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { User } from '../models/song.model'; // Assuming User model is updated
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users'; // Base API URL for users

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves all song names for a specific user.
   * @param userId The ID of the user.
   * @returns An Observable of an array of song names (strings).
   */
  getAllSongsForUser(userId: string): Observable<string[]> {
    return this.getUserById(userId).pipe(
      map(user => user.songs || []), // Access the 'songs' array directly, or an empty array if null/undefined
      catchError(error => {
        console.error(`Error fetching songs for user ${userId}:`, error);
        return of([]); // Return an empty array on error
      })
    );
  }

  /**
   * Adds a song name to a user's list of songs.
   * Note: This assumes uniqueness by name is not strictly enforced at the database level
   * or will be handled by the backend if this service directly interacts with a real DB.
   * For JSON-Server, it will simply add the name.
   * @param userId The ID of the user.
   * @param songName The name of the song to add.
   * @returns An Observable of the updated User object.
   */
  addUserSong(userId: string, songName: string): Observable<User> {
    return this.getUserById(userId).pipe(
      switchMap(user => {
        // Prevent adding duplicates if you desire, though your spec doesn't require it.
        // For example: if (!user.songs.includes(songName)) {
        user.songs.push(songName);
        // }
        return this.updateUser(user);
      }),
      catchError(error => {
        console.error(`Error adding song '${songName}' for user ${userId}:`, error);
        return throwError(() => new Error(`Could not add song for user ${userId}`));
      })
    );
  }

  /**
   * Deletes a song name from a user's list of songs.
   * This will remove *all* occurrences of the given song name from the user's list.
   * If you need to remove only one instance or handle duplicates differently,
   * the logic here would need to be more complex (e.g., if songs were objects with unique IDs).
   * @param userId The ID of the user.
   * @param songName The name of the song to delete.
   * @returns An Observable of the updated User object.
   */
  deleteUserSong(userId: string, songName: string): Observable<User> {
    return this.getUserById(userId).pipe(
      switchMap(user => {
        // Filter out all occurrences of the songName
        const initialLength = user.songs.length;
        user.songs = user.songs.filter(name => name !== songName);

        if (user.songs.length === initialLength) {
          // If the song name wasn't found, no update is needed.
          // You might choose to throw an error or just return the current user.
          console.warn(`Song '${songName}' not found for user ${userId}. No deletion performed.`);
          return of(user); // Or throw an error: throw new Error(`Song ${songName} not found`);
        }
        return this.updateUser(user);
      }),
      catchError(error => {
        console.error(`Error deleting song '${songName}' for user ${userId}:`, error);
        return throwError(() => new Error(`Could not delete song for user ${userId}`));
      })
    );
  }


  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }
}
