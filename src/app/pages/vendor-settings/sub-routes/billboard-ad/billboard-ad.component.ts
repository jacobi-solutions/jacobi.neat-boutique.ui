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
  public vendor: VendorDisplay;
  public heroTemplates: HeroAdTemplate[] = [];
  public currentToolTip: HTMLIonPopoverElement;
  public postedAd: boolean;
  public selectedHeroTemplate: HeroAdTemplate;
  public selectedHeroAd: HeroAd = new HeroAd;
  public adIsCreated = false;
  
  constructor(private _accountsService: AccountsService, private _vendorSettingsService: VendorSettingsService,
      private _router: Router) {
        try {
          // Try to get vendor from router state
          const routerState = this._router.getCurrentNavigation()?.extras?.state;
          if (routerState) {
            this.vendor = routerState as VendorDisplay;
          }
          
          // If vendor is not available from router state, get it from accounts service
          if (!this.vendor || !this.vendor.id) {
            const currentUser = this._accountsService.currentUserSubject.getValue();
            if (currentUser && currentUser.vendor) {
              this.vendor = new VendorDisplay(currentUser.vendor);
            }
          }
          
          if (this.vendor && this.vendor.id) {
            this._loadHeroAds();
          } else {
            console.error('Vendor information not available');
            // Navigate back to vendor settings page
            this._router.navigateByUrl('/vendor-settings');
          }
        } catch (error) {
          console.error('Error initializing billboard ad component:', error);
          // Navigate back to vendor settings page
          this._router.navigateByUrl('/vendor-settings');
        }
      }

  ngOnInit() {}

  public async submitAd() {
    if (this.vendor.vendorSubscriptionPlan === SubscriptionPlanTypes.VENDOR_PREMIUM) {
      this.postedAd = await this._vendorSettingsService.createHeroAdForVendor(this.vendor.id, this.selectedHeroAd.category, 
      this.selectedHeroAd.adTagline, this.selectedHeroAd.callToAction, this.selectedHeroAd.imageUrl);
      this.adIsCreated = true;
    } else {
      this._router.navigateByUrl('/pricing');
    }
  }

  private async _loadHeroAds() {
    try {
      this.heroTemplates = await this._vendorSettingsService.getHeroAdTemplatesForVendor();
      if (this.heroTemplates && this.heroTemplates.length > 0) {
        this.selectedHeroAd.category = this.heroTemplates[0].category;
        this.selectHeroTemplateByCategory();
      } else {
        console.error('No hero templates available');
      }
    } catch (error) {
      console.error('Error loading hero ads:', error);
      // Display an error message to the user
      // Alternatively, navigate back to the vendor settings page
      // this._router.navigateByUrl('/vendor-settings');
    }
  }
  
  selectHeroTemplateByCategory() {
    this.selectedHeroTemplate = this.heroTemplates.find(x => x.category === this.selectedHeroAd.category);
    if (this.selectedHeroTemplate) {
      this.selectedHeroAd.adTagline = this.selectedHeroTemplate.adTaglines[0];
      this.selectedHeroAd.callToAction = this.selectedHeroTemplate.callsToAction[0];
      this.selectedHeroAd.imageUrl = this.selectedHeroTemplate.imageUrls[0];
    }
  }
}
