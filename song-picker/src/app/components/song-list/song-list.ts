import { Component } from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-song-list',
  imports: [
    MatList,
    MatListItem
  ],
  templateUrl: './song-list.html',
  styleUrl: './song-list.scss'
})
export class SongList {

}
