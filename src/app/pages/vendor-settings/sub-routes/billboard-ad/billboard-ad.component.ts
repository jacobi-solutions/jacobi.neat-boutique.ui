import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionPlanTypes } from 'src/app/constants/subscription-plan-types';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { HeroAd, HeroAdTemplate } from 'src/app/services/neat-boutique-api.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';

@Component({
  selector: 'app-billboard-ad',
  templateUrl: './billboard-ad.component.html',
  styleUrls: ['./billboard-ad.component.scss'],
})
export class BillboardAdComponent implements OnInit {
  public pageName: string = 'Hero Ad';
  public vendor: VendorDisplay
  public heroTemplates: HeroAdTemplate[] = [];
  public currentToolTip: HTMLIonPopoverElement;
  public postedAd: boolean;
  public selectedHeroTemplate: HeroAdTemplate;
  public selectedHeroAd: HeroAd = new HeroAd;
  public adIsCreated = false;
  constructor(private _accountsService: AccountsService, private _vendorSettingsService: VendorSettingsService,
      private _router: Router) {
        this.vendor = (this._router.getCurrentNavigation().extras.state) as VendorDisplay;  
        this._loadHeroAds();
       }

  ngOnInit() {
     

    
  }

  public async submitAd() {
    if (this.vendor.vendorSubscriptionPlan === SubscriptionPlanTypes.VENDOR_PREMIUM) {
      this.postedAd = await this._vendorSettingsService.createHeroAdForVendor(this.vendor.id, this.selectedHeroAd.categoryName, 
      this.selectedHeroAd.adTagline, this.selectedHeroAd.callToAction, this.selectedHeroAd.imageUrl);
      this.adIsCreated = true;
    } else {
      this._router.navigateByUrl('/pricing');
    }
  }

  private async _loadHeroAds() {
    this.heroTemplates = await this._vendorSettingsService.getHeroAdTemplatesForVendor();
    this.selectedHeroAd.categoryName = this.heroTemplates[0].categoryName;
    this.selectHeroTemplateByCategory();
  }
  selectHeroTemplateByCategory() {
    this.selectedHeroTemplate = this.heroTemplates.find(x => x.categoryName === this.selectedHeroAd.categoryName);
    this.selectedHeroAd.adTagline = this.selectedHeroTemplate.adTaglines[0];
    this.selectedHeroAd.callToAction = this.selectedHeroTemplate.callsToAction[0];
    this.selectedHeroAd.imageUrl = this.selectedHeroTemplate.imageUrls[0];
  }
  
}
