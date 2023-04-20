import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-jacobi-button',
  templateUrl: './jacobi-button.component.html',
  styleUrls: ['./jacobi-button.component.scss'],
})
export class JacobiButtonComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() buttonType: string;
  @Input() altStyle: string;
  constructor() {
  }

  ngOnInit() {}

}
