import { Component } from '@angular/core';
import {HeroSong} from '../../components/hero-song/hero-song';
import {SongList} from '../../components/song-list/song-list';

@Component({
  selector: 'app-frontpage',
  imports: [
    HeroSong,
    SongList
  ],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.scss'
})
export class Frontpage {

}
