import { Component, OnInit } from '@angular/core';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorService as VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-vendor-settings',
  templateUrl: './vendor-settings.page.html',
  styleUrls: ['./vendor-settings.page.scss'],
})
export class VendorSettingsPage implements OnInit {

  public pageName: string = 'vendor-settings';
  public currentUser: CurrentUserDisplay = null;
  public vendor: VendorDisplay = null;
  public newLogo: any;
  public newLogoFileType: string;

  constructor(private _accountsService: AccountsService, private _vendorService: VendorService) {    
    // watch for user changes
    this._accountsService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      if (user) {
        this.currentUser = user;
        this.vendor = new VendorDisplay(user.vendor);
        this._vendorService.getVendorProfileWithReviewsById(this.vendor.id).then((vendor: VendorDisplay) => {
          if (vendor) {
            this.vendor = vendor;
          }
        });
      }
    });
  }
  
  ngOnInit() {}
}
