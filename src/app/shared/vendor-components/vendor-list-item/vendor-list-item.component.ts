import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { THEME } from 'src/theme/theme-constants';

@Component({
  selector: 'app-vendor-list-item',
  templateUrl: './vendor-list-item.component.html',
  styleUrls: ['./vendor-list-item.component.scss'],
})
export class VendorListItemComponent implements OnInit {

  @Input() vendor: VendorDisplay
  public defaultImg = THEME.avatar.defaultImage;

  constructor(private _router: Router) { }

  ngOnInit() {
   
  }

  public goToVendorProfile(vendor: VendorDisplay) {
    this._router.navigateByUrl('/vendor-profile/' + vendor.profilePath);
  }

}
