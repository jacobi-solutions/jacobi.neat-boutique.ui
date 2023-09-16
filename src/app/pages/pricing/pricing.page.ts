import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SubscriptionPlanTypes } from 'src/app/models/constants';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.page.html',
  styleUrls: ['./pricing.page.scss'],
})
export class PricingPage implements OnInit {
  public isAuthenticated: boolean;
  vendorForSubscriptionChange: VendorDisplay = null;
  numberOfBusinessesConnected: number = 0;
  hasPremiumAccount: boolean = false;
  subscriptionPlanTypes = SubscriptionPlanTypes;
  standardPricing: string = "$65";
  premiumPricing: string = "$95";
  private _needsPremiumAccountForAddModal: HTMLIonModalElement;
  private _needsPremiumAccountForChange: HTMLIonModalElement;

  constructor(private _vendorSubscriptionService: VendorSubscriptionService, private _authService: AuthService,
    private _router: Router, private _modalService: ModalService) { 
      
    }

    ionViewDidEnter() {
      this.vendorForSubscriptionChange = this._vendorSubscriptionService.getVendorForPricingPage();
      this.standardPricing = "$65";
      this.premiumPricing = "$95";

      this._vendorSubscriptionService.numberOfBusinessesAlreadyConnectedSubject.subscribe((numberOfBusinessesAlreadyConnected: number) => {
        if(numberOfBusinessesAlreadyConnected) {
          this.numberOfBusinessesConnected = numberOfBusinessesAlreadyConnected;
          if(this.vendorForSubscriptionChange) {
            if(this.vendorForSubscriptionChange.stripePriceId === environment.subscriptionStandardAdditionalBusinessesStripePriceId ||
              this.vendorForSubscriptionChange.stripePriceId === environment.subscriptionPremiumAdditionalBusinessesStripePriceId) {
                this.standardPricing = "$45";
                this.premiumPricing = "$75";
            }
          } else if(this.numberOfBusinessesConnected > 0) {
            this.standardPricing = "$45";
            this.premiumPricing = "$75";
          }
        }
      });
      

      this._vendorSubscriptionService.hasPremiumAccountSubject.subscribe((hasPremiumAccount: boolean) => {
        if(hasPremiumAccount != null) {
          this.hasPremiumAccount = hasPremiumAccount;
        }
      });
  
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

  upgradeSelectedVendorSubscriptionToPremium() {
    if(this.numberOfBusinessesConnected === 1) {
      this._vendorSubscriptionService.upgradeOnlyVendorSubscriptionToPremium(this.vendorForSubscriptionChange);
    } else if(this.numberOfBusinessesConnected > 1)  {
      this._vendorSubscriptionService.upgradeSelectedVendorSubscriptionToPremium(this.vendorForSubscriptionChange);
    }
  }

  downgradeSelectedVendorSubscriptionToStandard() {
    if(this.numberOfBusinessesConnected === 1) {
      this._vendorSubscriptionService.downgradeOnlyVendorSubscriptionToStandard(this.vendorForSubscriptionChange);
    } else if(this.numberOfBusinessesConnected > 1)  {
      this._vendorSubscriptionService.downgradeSelectedVendorSubscriptionToStandard(this.vendorForSubscriptionChange);
    }
    
  }

  cancelVendorSubscription() {
    this._vendorSubscriptionService.startVendorSubscriptionCancelation(this.vendorForSubscriptionChange);
  }

  startVendorSubscriptionWithPremium() {
    this._vendorSubscriptionService.startFirstVendorSubscriptionWithPremium();
  }

  addVendorSubscriptionWithPremium() {
    if(this.hasPremiumAccount) {
      this._vendorSubscriptionService.startAdditionalVendorSubscriptionWithPremium();
    } else {
      this.needsPremiumAccountForAddConfirm();
    }
  }

  startVendorSubscriptionWithStandard() {
    this._vendorSubscriptionService.startFirstVendorSubscriptionWithStandard();
  }
  addVendorSubscriptionWithStandard() {
    if(this.hasPremiumAccount) {
      this._vendorSubscriptionService.startAdditionalVendorSubscriptionWithStandard();
    } else {
      this.needsPremiumAccountForAddConfirm();
    }
  }

  async needsPremiumAccountForAddConfirm() {
    const self = this;
    const showCancelBtn = true;
    const html = `
      <h1>We're glad to help.</h1>
      <p class="text-left-align modal-p-min">
        In order to add another business to this account, your first business must be on the premium subscription. To do that, upgrade your first business to premium.
      </p>
    `;

    const confirmBtn = {
      label: 'Manage Business',
      // callback: this.addNewPost
      callback() {
        // self.userHasSeenNonEditableModal = true;
        // self._communityService.userHasSeenNonEditableModal = true;
        // self._vendorSubscriptionService.startVendorSubscriptionCancelation(self.currentUser.vendor);
        self._router.navigateByUrl('/vendor-settings');
        self._needsPremiumAccountForAddModal.dismiss();
      }
    };

    this._needsPremiumAccountForAddModal = await this._modalService.displayConfirmActionModal(html, confirmBtn, showCancelBtn);
  }

  async needsPremiumAccountForChangeConfirm() {
    const self = this;
    const showCancelBtn = true;
    const html = `
      <h1>We're glad to help.</h1>
      <p class="text-left-align modal-p-min">
        In order to continue managing multiple bussinesses from this account, you need to keep the premium subscription. In order to downgrade to standard, you must first cancel the other busienesses.
      </p>
    `;

    const confirmBtn = {
      label: 'Manage Businesses',
      // callback: this.addNewPost
      callback() {
        // self.userHasSeenNonEditableModal = true;
        // self._communityService.userHasSeenNonEditableModal = true;
        // self._vendorSubscriptionService.startVendorSubscriptionCancelation(self.currentUser.vendor);
        self._router.navigateByUrl('/vendor-businesses');
        self._needsPremiumAccountForChange.dismiss();
      }
    };

    this._needsPremiumAccountForChange = await this._modalService.displayConfirmActionModal(html, confirmBtn, showCancelBtn);
  }
}
