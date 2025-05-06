import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionPlanTypes } from 'src/app/constants/subscription-plan-types';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-edit-hero-ad',
  templateUrl: './edit-hero-ad.component.html',
  styleUrls: ['./edit-hero-ad.component.scss'],
})
export class EditHeroAdComponent implements OnInit {
  @Input() vendor: VendorDisplay;
  subscriptionPlanTypes = SubscriptionPlanTypes;
  constructor(private _router: Router, private _vendorSubscriptionService: VendorSubscriptionService) {
    
  }

  ngOnInit() {}

  // public async editHeroImgAd() {
  //   const { data: heroAd } = await this._modelService.displayEditHeroImgAdModal();
  // }

  goToBillboardAds() {
    if(this.vendor?.vendorSubscriptionPlan === SubscriptionPlanTypes.VENDOR_STANDARD) {
      this.changeSubscription();
    } else {
      this._router.navigate(['/vendor-settings/billboard-ads'], { state: this.vendor });
    }
  }

  changeSubscription() {
    this._vendorSubscriptionService.setVendorForPricingPage(this.vendor);
    this._router.navigateByUrl('/pricing');
  }
}
