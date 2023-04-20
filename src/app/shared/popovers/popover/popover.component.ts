import { Component, Input, OnInit } from '@angular/core';
import { PopoverItem } from '../types/popover-types';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  @Input() itemList: PopoverItem[] = [];

  constructor() { }

  ngOnInit() {}
}
