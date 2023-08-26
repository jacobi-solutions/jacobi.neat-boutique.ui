import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SubscriptionPlanTypes } from 'src/app/models/constants';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
})
export class PricingPage implements OnInit {
  public isAuthenticated: boolean;
  singleVendor: VendorDisplay = null;
  hasNoSubscription = false;
  hasAtLeastOneVendor = false;
  subscriptionPlanTypes = SubscriptionPlanTypes;

  constructor(private _vendorSubscriptionService: VendorSubscriptionService, private _authService: AuthService,
    private _router: Router, private _accountsService: AccountsService) { 
      var vendorProfile = (this._router.getCurrentNavigation().extras.state) as VendorDisplay;  
      if(vendorProfile) {
        this.singleVendor = new VendorDisplay(vendorProfile);
      } else {
        this._accountsService.currentUserSubject.subscribe((userDisplay: CurrentUserDisplay) => {
          if(userDisplay.vendors?.length === 0) {
            this.hasNoSubscription = true;
          } 
          else if(userDisplay.vendors?.length > 0) {
            this.hasAtLeastOneVendor = true
          }
        });
      }

      this._authService.isAuthenticated().then((isAuthenticated) => {
        if(isAuthenticated) {
          this.isAuthenticated = true;
        }
      });
    }

  async ngOnInit() {
   
  }

  upgradeVendorSubscriptionToPremium() {
    this._vendorSubscriptionService.upgradeVendorSubscriptionToPremium(this.singleVendor);
  }

  downgradeVendorSubscriptionToStandard() {
    this._vendorSubscriptionService.downgradeVendorSubscriptionToStandard(this.singleVendor);
  }

  cancelVendorSubscription() {
    this._vendorSubscriptionService.startVendorSubscriptionCancelation(this.singleVendor);
  }

  startVendorSubscriptionWithPremium() {
    this._vendorSubscriptionService.startVendorSubscriptionWithPremium();
  }

  startVendorSubscriptionWithStandard() {
    this._vendorSubscriptionService.startVendorSubscriptionWithStandard();
  }
}
