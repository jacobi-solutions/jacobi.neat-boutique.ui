import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { SubscriptionPackage } from 'src/app/models/vendor-subscription-package';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
import { environment } from 'src/environments/environment';

declare global {
  interface Window {
    paypal: any;
  }
}

@Component({
  selector: 'app-vendor-package-pricing',
  templateUrl: './vendor-package-pricing.component.html',
  styleUrls: ['../../vendor-connect.page.scss', './vendor-package-pricing.component.scss'],
})
export class VendorPackagePricingComponent implements OnInit {
  showPromoCodeForm: boolean;
  promoCodeMessage: string;
  isPromoCodeApplied: boolean;
  promoCodeWorked: boolean;
  public promoCodeForm = new FormGroup({
    promoCode: new FormControl('', [  ])
  });
  numberOfBusinessesConnected: number = 0;
  constructor(private _navCtrl: NavController, private _vendorSubscriptionService: VendorSubscriptionService, 
    private _router: Router) { 
      this._vendorSubscriptionService.numberOfBusinessesAlreadyConnectedSubject.subscribe((numberOfBusinessesAlreadyConnected: number) => {
        if(numberOfBusinessesAlreadyConnected) {
          this.numberOfBusinessesConnected = numberOfBusinessesAlreadyConnected;
        }
      });
  }

  ngOnInit() {
    // this.payPalPlanPackage = this._vendorSubscriptionService.getPayPalPlanPackage();
    // this.showPayPalPayment = true;
  }

  setContentHeight(headerHeight) {
    const contentWrapper = document.querySelector('.vendor-connect > ion-grid.vendor-choose-pay-method');
    contentWrapper.setAttribute('style', `height: calc(100% - ${headerHeight}px)`);
  }
  
  async createStripeCheckout(vendorPackage: SubscriptionPackage ) {
    await this._vendorSubscriptionService.createStripeCheckout(vendorPackage);
    // this._router.navigateByUrl('/vendor-settings');
  }

  cancel() {
    this._navCtrl.back();
  }

}
