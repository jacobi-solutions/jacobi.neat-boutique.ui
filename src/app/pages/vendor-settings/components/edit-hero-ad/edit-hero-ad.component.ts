import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionPlanTypes } from 'src/app/models/constants';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';

@Component({
  selector: 'app-edit-hero-ad',
  templateUrl: './edit-hero-ad.component.html',
  styleUrls: ['./edit-hero-ad.component.scss'],
})
export class EditHeroAdComponent implements OnInit {
  @Input() vendor: VendorDisplay;
  subscriptionPlanTypes = SubscriptionPlanTypes;
  constructor(private _accountsService: AccountsService, private _router: Router) {
    
  }

  ngOnInit() {}

  // public async editHeroImgAd() {
  //   const { data: heroAd } = await this._modelService.displayEditHeroImgAdModal();
  // }

  goToBillboardAds() {
    if(this.vendor?.vendorSubscriptionPlan === SubscriptionPlanTypes.VENDOR_STANDARD) {
      this.goToPricing();
    } else {
      this._router.navigateByUrl('/vendor-settings/community-billboard-ads', { state: this.vendor });
    }
    
  }

  goToPricing() {
    this._router.navigateByUrl('/pricing', { state: this.vendor });
  }
}
