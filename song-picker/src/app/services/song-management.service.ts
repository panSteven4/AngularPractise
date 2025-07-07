import {inject, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Song} from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongManagementService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/songs';

  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.apiUrl);
  }

  getSongById(id: string): Observable<Song> {
    return this.http.get<Song>(`${this.apiUrl}/${id}`);
  }

  // Example: Add a new song
  addSong(song: Omit<Song, 'id'>): Observable<Song> {
    return this.http.post<Song>(this.apiUrl, song);
  }

  // Example: Update a song
  updateSong(song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.apiUrl}/${song.id}`, song);
  }

  // Example: Delete a song
  deleteSong(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
