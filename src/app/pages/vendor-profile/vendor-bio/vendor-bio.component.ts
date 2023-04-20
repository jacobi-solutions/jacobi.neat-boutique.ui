import { Component, Input, OnInit } from '@angular/core';
import { VendorDisplay } from 'src/app/models/vendor-display';

@Component({
  selector: 'app-vendor-bio',
  templateUrl: './vendor-bio.component.html',
  styleUrls: ['../vendor-profile.page.scss', './vendor-bio.component.scss'],
})
export class VendorBioComponent implements OnInit {

  @Input() vendor: VendorDisplay;

  constructor() {

   }

  ngOnInit() {
  }

}
