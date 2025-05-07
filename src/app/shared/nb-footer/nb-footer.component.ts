import { Component, OnInit } from '@angular/core';
import { NavigationItem } from '../../models/navigation-item';
import { LociConstants } from 'src/app.version';

@Component({
  selector: 'app-nb-footer',
  templateUrl: './nb-footer.component.html',
  styleUrls: ['./nb-footer.component.scss'],
})
export class NbFooterComponent implements OnInit {
  lociConstants = LociConstants;
  public footerNav: NavigationItem[];
  constructor() {
    this.footerNav = [
      {
        name: 'Contact Us',
        href: ''
      },
      {
        name: 'Advertising',
        href: ''
      },
      {
        name: 'Cookies',
        href: ''
      },
      {
        name: 'Privacy Policy',
        href: ''
      },
      {
        name: 'Ad Choices',
        href: ''
      },
      {
        name: 'Loçi &copy;2025',
        href: ''
      },
    ];
  }

  ngOnInit() {}

}
