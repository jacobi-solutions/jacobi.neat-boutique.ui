import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss'],
})
export class ToolTipComponent implements OnInit {

  @Input() htmlTemplate: string;

  constructor() { }

  ngOnInit() {}

}
