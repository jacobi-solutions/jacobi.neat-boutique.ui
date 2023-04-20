import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  constructor(private _platform: Platform, private _router: Router) {
    if (!this._platform.is("capacitor")) {
      if (this._platform.is("ios") || this._platform.is("ipad") || this._platform.is("iphone")) {
        window.location.href = environment.appleAppstoreListingUrl;
      } else if (this._platform.is("android")) {
        window.location.href = environment.googlePlayListingUrl;
      } else {
        this._router.navigateByUrl('/home');
      }
    } else {
      this._router.navigateByUrl('/home');
    }
  }

  ngOnInit() {
  }

}
