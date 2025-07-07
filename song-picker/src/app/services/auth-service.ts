// src/app/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import {User} from '../models/song.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users'; // To fetch users for login
  private _currentUserId = new BehaviorSubject<string | null>("u1"); // Default to a user ID for testing

  // Expose as a signal for easy consumption in components
  currentUserId = signal<string>("u1");

  // A signal to indicate if the user is logged in
  isLoggedIn = signal(false);

  constructor() {
    // Synchronize the BehaviorSubject with the Signal
    this._currentUserId.subscribe(userId => {
      userId && this.currentUserId.set(userId);
      this.isLoggedIn.set(!!userId); // Set isLoggedIn based on whether userId exists
    });

    // Simulate checking for a "session" on app start
    // In a real app, you'd check localStorage for a token
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      this._currentUserId.next(storedUserId);
    }
  }

  // Very simple simulated login
  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => {
        const user = users[0]; // JSON-Server returns an array, take the first match
        if (user && user.password === password) { // Simple password check
          this._currentUserId.next(user.id);
          localStorage.setItem('currentUserId', user.id); // Simulate session persistence
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(err => {
        console.error('Login error:', err);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  logout(): void {
    this._currentUserId.next(null);
    localStorage.removeItem('currentUserId');
  }

  // Get the full user object for the logged-in user
  getLoggedInUser(): Observable<User | null> {
    // Using switchMap to react to currentUserId changes
    return this._currentUserId.pipe(
      switchMap(userId => {
        if (!userId) {
          return of(null);
        }
        return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
          catchError(err => {
            console.error('Failed to fetch logged-in user details:', err);
            this.logout(); // Logout if user details cannot be fetched
            return of(null);
          })
        );
      })
    );
  }
}
