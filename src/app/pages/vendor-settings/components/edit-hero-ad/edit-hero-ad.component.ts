import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';

@Component({
  selector: 'app-edit-hero-ad',
  templateUrl: './edit-hero-ad.component.html',
  styleUrls: ['./edit-hero-ad.component.scss'],
})
export class EditHeroAdComponent implements OnInit {
  

  public currentUser: CurrentUserDisplay;
  constructor(private _accountsService: AccountsService, private _router: Router) {
    this._accountsService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
      if(currentUser) {
        this.currentUser = currentUser
      }
    });
  }

  ngOnInit() {}

  // public async editHeroImgAd() {
  //   const { data: heroAd } = await this._modelService.displayEditHeroImgAdModal();
  // }

  goToBillboardAds() {
    if(!this.currentUser?.vendor?.hasVendorPremiumSubscription) {
      this._router.navigateByUrl('/pricing');
    } else {
      this._router.navigateByUrl('/vendor-settings/community-billboard-ads');
    }
    
  }
}
