import {Component, inject} from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';
import {MatMiniFabButton} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {UserService} from '../../services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-already-played-list',
  imports: [
    MatList,
    MatListItem,
    MatIcon,
    MatMiniFabButton,
    ReactiveFormsModule
  ],
  templateUrl: './already-played-list.html',
  styleUrl: './already-played-list.scss'
})
export class AlreadyPlayedList {
  private readonly userService= inject(UserService);

  alreadyPlayedSongs = toSignal(this.userService.select('alreadyPlayedSongs'));

  deleteSong(songName: string) {
    //todo
  }
}
