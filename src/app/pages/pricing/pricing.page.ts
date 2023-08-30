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
  numberOfBusinessesConnected: number = 0;
  subscriptionPlanTypes = SubscriptionPlanTypes;

  constructor(private _vendorSubscriptionService: VendorSubscriptionService, private _authService: AuthService,
    private _router: Router) { 
      
    }

    ionViewDidEnter() {
    this.singleVendor = this._vendorSubscriptionService.getVendorForPricingPage();
     if(!this.singleVendor) {
        this._vendorSubscriptionService.numberOfBusinessesAlreadyConnectedSubject.subscribe((numberOfBusinessesAlreadyConnected: number) => {
          if(numberOfBusinessesAlreadyConnected) {
            this.numberOfBusinessesConnected = numberOfBusinessesAlreadyConnected;
          }
        });
      }
  
      this._authService.isAuthenticated().then((isAuthenticated) => {
        if(isAuthenticated) {
          this.isAuthenticated = true;
        }
      });
    }

    ionViewDidLeave() {
      this._vendorSubscriptionService.clearVendorForPricingPage();
    }

  async ngOnInit() {
    
  }

  upgradeVendorSubscriptionToPremium() {
    if(this.numberOfBusinessesConnected === 1) {
      this._vendorSubscriptionService.upgradeOnlyVendorSubscriptionToPremium(this.singleVendor);
    } else if(this.numberOfBusinessesConnected > 1)  {
      this._vendorSubscriptionService.upgradeAdditionalVendorSubscriptionToPremium(this.singleVendor);
    }
  }

  downgradeVendorSubscriptionToStandard() {
    if(this.numberOfBusinessesConnected === 1) {
      this._vendorSubscriptionService.downgradeOnlyVendorSubscriptionToStandard(this.singleVendor);
    } else if(this.numberOfBusinessesConnected > 1)  {
      this._vendorSubscriptionService.downgradeAdditonalVendorSubscriptionToStandard(this.singleVendor);
    }
    
  }

  cancelVendorSubscription() {
    this._vendorSubscriptionService.startVendorSubscriptionCancelation(this.singleVendor);
  }

  startVendorSubscriptionWithPremium() {
    this._vendorSubscriptionService.startVendorSubscriptionWithPremium();
  }

  addVendorSubscriptionWithPremium() {
    this._vendorSubscriptionService.addVendorSubscriptionWithPremium();
  }

  startVendorSubscriptionWithStandard() {
    this._vendorSubscriptionService.startVendorSubscriptionWithStandard();
  }
  addVendorSubscriptionWithStandard() {
    this._vendorSubscriptionService.addVendorSubscriptionWithStandard();
  }
}
