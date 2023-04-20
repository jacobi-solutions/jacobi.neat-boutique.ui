import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent implements OnInit {
  @ViewChild('slidingPrompt')
  public slidingPrompt: ElementRef;
  @Input() title;
  @Input() description;
  constructor() { }

  ngOnInit() {}

}
