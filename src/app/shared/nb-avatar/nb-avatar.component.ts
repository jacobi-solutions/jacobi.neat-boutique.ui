import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { THEME } from 'src/theme/theme-constants';


@Component({
  selector: 'app-nb-avatar',
  templateUrl: './nb-avatar.component.html',
  styleUrls: ['./nb-avatar.component.scss'],
})
export class NbAvatarComponent implements OnInit {
  @ViewChild('customColor', { read: ElementRef }) customColor: ElementRef;
  @Input() username: string;
  @Input() secondaryText: string;
  @Input() tertiaryText: string;
  @Input() imageSrc: string;
  @Input() borderColor: string = '#dc7730';
  @Input() altStyleClass: string;
  @Input() colorAlt: string;
  @Input() truncateName: number;
  @Input() truncateSecondaryText: number;
  @Input() size: string;
  // @Input() directStyles: {};

  public dynamicStyles: {};

  public defaultProfileImg = THEME.avatar.defaultImage;
  
  constructor(public renderer: Renderer2) {
    if(!this.borderColor || this.borderColor === '') {
      this.borderColor = '#dc7730';
    }
  }

  ngOnInit() {
    
    // this.dynamicStyles = { ...this.directStyles, 'border-color': this.borderColor };
  }

  ngAfterViewInit() {
    if(this.customColor && this.colorAlt) {
      this.renderer.setStyle(this.customColor.nativeElement, 'color', this.colorAlt);
    }
  }
}
