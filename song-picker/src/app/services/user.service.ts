import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Song, User} from '../models/song.model';
import {catchError, map, switchMap} from 'rxjs/operators';
import {SongManagementService} from './song-management.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private songService = inject(SongManagementService); // Inject SongService
  private apiUrl = '/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getAllSongsForUser(userId: string): Observable<Song[]> {
    return this.getUserById(userId).pipe(
      // Step 1: Get the user object
      map(user => {
        // Collect all unique song IDs from all of the user's playlists
        const allUserSongIds = new Set<string>();
        user.playlists.forEach(playlist => {
          playlist.songIds.forEach(songId => allUserSongIds.add(songId));
        });
        return Array.from(allUserSongIds); // Convert Set back to Array
      }),
      // Step 2: Use switchMap to switch from the stream of song IDs to a stream of filtered songs
      switchMap(songIds => {
        if (songIds.length === 0) {
          return of([]); // If no song IDs, return an empty array immediately
        }
        // Fetch all songs once, then filter them
        return this.songService.getSongs().pipe(
          map(allSongs => {
            return allSongs.filter(song => songIds.includes(song.id));
          })
        );
      }),
      catchError(error => {
        console.error(`Error fetching songs for user ${userId}:`, error);
        return of([]); // Return an empty array on error
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }
}
