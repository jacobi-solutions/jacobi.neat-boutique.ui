import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
import { THEME } from 'src/theme/theme-constants';

@Component({
  selector: 'app-vendor-list-item',
  templateUrl: './vendor-list-item.component.html',
  styleUrls: ['./vendor-list-item.component.scss'],
})
export class VendorListItemComponent implements OnInit {

  @Input() vendor: VendorDisplay
  public defaultImg = THEME.avatar.defaultImage;
  currentUser: CurrentUserDisplay;
  currentUserOwnsVendor: boolean = false;
  // showVendorActions: boolean = false;

  constructor(private _router: Router, private _vendorSubscriptionService: VendorSubscriptionService, private _accountsService: AccountsService) { 
    
  }

  ngOnInit() {
    this._accountsService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
      if(currentUser) {
        this.currentUser = currentUser;
        if(this.currentUser.hasId(this.vendor.id)) {
          this.currentUserOwnsVendor = true;
        }
       }
    });
  }

  public goToVendor(vendor: VendorDisplay) {
    if(this.currentUserOwnsVendor) {
      this._router.navigateByUrl('vendor-settings', { state: vendor });
    } else {
      this._router.navigateByUrl('/vendor-profile/' + vendor.profilePath);
    }
  }

  

  changeSubscription(vendor: VendorProfile) {
    this._vendorSubscriptionService.setVendorForPricingPage(vendor);
    this._router.navigateByUrl('/pricing');
  }
}
