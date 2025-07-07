import { Component } from '@angular/core';
import {MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'app-already-played-list',
  imports: [
    MatList,
    MatListItem
  ],
  templateUrl: './already-played-list.html',
  styleUrl: './already-played-list.scss'
})
export class AlreadyPlayedList {

}
