import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
})
export class PricingPage implements OnInit {
  public isAuthenticated: boolean;
  public isVendor: boolean;
  public isPremiumVendor: boolean;
  private _currentUser: CurrentUserDisplay;
  constructor(private _vendorSubscriptionService: VendorSubscriptionService, private _accountsService: AccountsService,
    private _router: Router) { }

  async ngOnInit() {
    
    this._accountsService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
      if(currentUser) {
        this._currentUser = currentUser;
        this.isAuthenticated = true;
        if(currentUser.vendor) {
          this.isVendor = true;
          this.isPremiumVendor = currentUser.vendor.hasVendorPremiumSubscription;
        }
      }
    })
  }

  upgradeVendorSubscriptionToPremium() {
    this._vendorSubscriptionService.upgradeVendorSubscriptionToPremium(this._currentUser.vendor);
  }

  downgradeVendorSubscriptionToStandard() {
    this._vendorSubscriptionService.downgradeVendorSubscriptionToStandard(this._currentUser.vendor);
  }

  cancelVendorSubscription() {
    this._vendorSubscriptionService.startVendorSubscriptionCancelation(this._currentUser.vendor);
  }

  startVendorSubscriptionWithPremium() {
    this._vendorSubscriptionService.startVendorSubscriptionWithPremium();
  }

  startVendorSubscriptionWithStandard() {
    this._vendorSubscriptionService.startVendorSubscriptionWithStandard();
  }
}
