import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorSubscriptionPackage, VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
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
  constructor(private _navCtrl: NavController, private _vendorSubscriptionService: VendorSubscriptionService, 
    private _router: Router, private _accountsService: AccountsService) { 
    
  }

  ngOnInit() {
    // this.payPalPlanPackage = this._vendorSubscriptionService.getPayPalPlanPackage();
    // this.showPayPalPayment = true;
  }

  setContentHeight(headerHeight) {
    const contentWrapper = document.querySelector('.vendor-connect > ion-grid.vendor-choose-pay-method');
    contentWrapper.setAttribute('style', `height: calc(100% - ${headerHeight}px)`);
  }
  
  async createStripeCheckout(vendorPackage: VendorSubscriptionPackage ) {
    await this._vendorSubscriptionService.createStripeCheckout(vendorPackage);
    // this._router.navigateByUrl('/vendor-settings');
  }

  cancel() {
    this._navCtrl.back();
  }

}
