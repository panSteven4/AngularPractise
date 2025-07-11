import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {UserService} from '../../services/user.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-song',
  imports: [
    MatButton
  ],
  templateUrl: './hero-song.html',
  styleUrl: './hero-song.scss'
})
export class HeroSong {
  private readonly userService = inject(UserService);
  heroSong = toSignal(this.userService.select('heroSong'));
  songsToPlay = toSignal(this.userService.select('songsToPlay'));

  playNextSong() {
    this.userService.playNextSong();
  }
}
