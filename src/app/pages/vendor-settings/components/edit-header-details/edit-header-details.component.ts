import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { SubscriptionPlanTypes } from 'src/app/constants/subscription-plan-types';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ModalService } from 'src/app/services/modal.service';
import { VendorSubscriptionResponse } from 'src/app/services/neat-boutique-api.service';
import { EditVendorExitCodes, VendorSettingsService } from 'src/app/services/vendor-settings.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
import { THEME } from 'src/theme/theme-constants';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-edit-header-details',
  templateUrl: './edit-header-details.component.html',
  styleUrls: ['../../vendor-settings.page.scss', './edit-header-details.component.scss'],
})
export class EditHeaderDetailsComponent implements OnInit {

  @Input() vendor: VendorDisplay = null;
  public defaultLogoImg = THEME.avatar.defaultImage;
  public editExitCodes = EditVendorExitCodes;
  public showEditVendorLogoComponent: boolean;
  public showChangeVendorSubscription: boolean;
  public subscriptionPlanTypes = SubscriptionPlanTypes;

  constructor(private _modelService: ModalService, private _vendorSettings: VendorSettingsService, 
    private _modalService: ModalService, private _platform: Platform, private _router: Router,
    private _vendorSubscriptionService: VendorSubscriptionService, private _networkService: NetworkService) {}

  ngOnInit() {
    if (!this._platform.is("capacitor")) {
      this.showChangeVendorSubscription = true;
    }
  }

  createCommunity() {
    this._router.navigate(['/vendor-settings/create-community'], { 
      state: this.vendor 
    });
  }

  public async editCategories() {
    const { data: updatedCategories } = await this._modelService.displayEditCategoriesModal(this.vendor?.categories || []);
    if(!updatedCategories || updatedCategories?.length === 0) {
      return EditVendorExitCodes.ERR_NO_COMMUNITY_SELECTED;
    }

    if(updatedCategories) {
      this.vendor = await this._vendorSettings.updateVendorCategories(this.vendor.id, updatedCategories);
      return EditVendorExitCodes.SUCCESS;
    }
  }

  editLogo(showLogoCropper: boolean) {    
    this.showEditVendorLogoComponent = showLogoCropper;
  }

  async showUploadPhotoModal() {
    const { data: { openPictureModal, newBorderColor } } = await this._modalService.displayChangeAvatarModal(this.vendor);

    if(newBorderColor) {
      var vendor = await this._vendorSettings.updateBorderColor(this.vendor.id, newBorderColor);
      this.vendor = new VendorDisplay(vendor);
    }

    if(openPictureModal) {
      const { data: { imgBase64Path } } = await this._modalService.displayPhotoUploadModal(true);
    
      if(imgBase64Path) {
        this.vendor.avatarSourceURL = imgBase64Path;
        this.vendor = await this._vendorSettings.uploadVendorLogo(this.vendor.id, imgBase64Path);
      }  
    }  
  }

  changeSubscription() {
    this._vendorSubscriptionService.setVendorForPricingPage(this.vendor);
    this._router.navigateByUrl('/pricing');
  }
  addAnotherBusiness() {
    this._router.navigateByUrl('/pricing');
  }

  goToMyCommunity() {
    if (this.vendor.network) {

      this._router.navigateByUrl('/network-community/' + this.vendor.network.id );
    }
  }

  showCheckInQr() {
    this._modalService.displayQrCheckInModal(this.vendor.id, this.vendor.name);
  }

}



