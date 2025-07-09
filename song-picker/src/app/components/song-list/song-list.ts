import {Component, inject, Signal, signal, WritableSignal} from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatMiniFabButton} from '@angular/material/button';
import {UserService} from '../../services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {Song, User} from '../../models/song.model';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {AuthService} from '../../services/auth-service';


@Component({
  selector: 'app-song-list',
  imports: [
    MatList,
    MatListItem,
    FormsModule,
    MatIcon,
    MatMiniFabButton,
    MatFormField,
    MatLabel,
    MatInput,
  ],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss'
})
export class SongList {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);


  // Expose songsToPlay as a signal using toSignal
  // This will automatically subscribe to the userService.select('songsToPlay') observable
  // and update the signal whenever the observable emits.
  songsToPlay = toSignal(this.userService.select('songsToPlay'), { initialValue: [] as Song[] });

  newSongName: string = '';

  // IMPORTANT: In a real app, you'd get the current user ID from AuthService.currentUserId()
  // For this example, we'll keep the placeholder.
  private readonly UserId = this.authService.currentUserId;

  addSong(): void {
    if (this.newSongName.trim() && this.UserId()) {
      const userId = this.UserId(); // Get the current user ID from AuthService
      if (!userId) {
        console.error('No user is logged in.');
        return;
      }
      this.userService.addUserSong(userId, this.newSongName.trim()).subscribe({
        next: () => {
          console.log(`Song "${this.newSongName}" added successfully.`);
          this.newSongName = ''; // Clear input
        },
        error: (err) => console.error('Error adding song:', err)
      });
    }
  }

  deleteSong(songName: Song): void {
    // todo
    // if (this.dummyUserId) {
    //   this.userService.deleteUserSong(this.dummyUserId, songName).subscribe({
    //     next: () => console.log(`Song "${songName}" deleted successfully.`),
    //     error: (err) => console.error('Error deleting song:', err)
    //   });
    // }
  }
}
