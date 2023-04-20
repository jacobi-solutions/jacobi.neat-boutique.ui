import { Component, Input, OnInit } from '@angular/core';
import { PopoverItem } from '../types/popover-types';

@Component({
  selector: 'app-form-drop-down-popover',
  templateUrl: './form-drop-down-popover.component.html',
  styleUrls: ['./form-drop-down-popover.component.scss'],
})
export class FormDropDownPopoverComponent implements OnInit {
  @Input() itemList: { label: string, value: any }[] = [];
  @Input() isMultiple: boolean;
  @Input() cancelBtnText: string;
  @Input() okBtnText: string;

  constructor() { }

  ngOnInit() {}
}
