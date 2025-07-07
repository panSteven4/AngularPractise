import {Component, signal, WritableSignal} from '@angular/core';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-hero-song',
  imports: [
    MatButton
  ],
  templateUrl: './hero-song.html',
  styleUrl: './hero-song.scss'
})
export class HeroSong {
  heroSong: WritableSignal<string> = signal("no song yet")
}
