import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';
import {FormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {MatMiniFabButton} from '@angular/material/button';
import {AuthService} from '../../services/auth-service';
import {UserService} from '../../services/user.service';
import {Song} from '../../models/song.model';
import {toSignal} from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-song-list',
  imports: [
    MatList,
    MatListItem,
    FormsModule,
    MatIcon,
    MatMiniFabButton,
  ],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss'
})
export class SongList {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  songs = toSignal(
    this.userService.getAllSongsForUser(this.authService.currentUserId()),
    { initialValue: [] as Song[] }
  );
}
