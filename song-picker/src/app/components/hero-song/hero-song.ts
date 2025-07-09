import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {UserService} from '../../services/user.service';

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
  heroSong: WritableSignal<string> = signal("no song yet")

  pickNewSong() {

  }
}
