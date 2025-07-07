import { Component } from '@angular/core';
import {HeroSong} from '../../components/hero-song/hero-song';
import {SongList} from '../../components/song-list/song-list';
import {AlreadyPlayedList} from '../../components/already-played-list/already-played-list';

@Component({
  selector: 'app-frontpage',
  imports: [
    HeroSong,
    SongList,
    AlreadyPlayedList
  ],
  templateUrl: './frontpage.html',
  styleUrl: './frontpage.scss'
})
export class Frontpage {

}
