import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nb-button',
  templateUrl: './nb-button.component.html',
  styleUrls: ['./nb-button.component.scss'],
})
export class NbButtonComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() buttonType: string;
  @Input() altStyle: string;
  constructor() { }

  ngOnInit() {}
}
