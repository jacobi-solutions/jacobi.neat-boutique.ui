import { Component, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ModalService } from 'src/app/services/modal.service';
import { EditVendorExitCodes, VendorSettingsService } from 'src/app/services/vendor-settings.service';
import { THEME } from 'src/theme/theme-constants';



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

  constructor(private _modelService: ModalService, private _vendorSettings: VendorSettingsService, 
    private _modalService: ModalService, private _platform: Platform) {}

  ngOnInit() {
    if (!this._platform.is("capacitor")) {
      this.showChangeVendorSubscription = true;
    }
  }
 
  public async editCommunities() {
    const { data: updatedCommunities } = await this._modelService.displayEditCommunitiesModal(this.vendor?.communities || []);
    if(!updatedCommunities || updatedCommunities?.length === 0) {
      return EditVendorExitCodes.ERR_NO_COMMUNITY_SELECTED;
    }

    if(updatedCommunities) {
      this.vendor = await this._vendorSettings.updateVendorCommunities(updatedCommunities);
      return EditVendorExitCodes.SUCCESS;
    }
  }

  editLogo(showLogoCropper: boolean) {    
    this.showEditVendorLogoComponent = showLogoCropper;
  }

  async showUploadPhotoModal() {
    const { data: { openPictureModal, newBorderColor } } = await this._modalService.displayChangeAvatarModal(this.vendor);

    if(newBorderColor) {
      var vendor = await this._vendorSettings.updateBorderColor(newBorderColor);
      this.vendor = new VendorDisplay(vendor);
    }

    if(openPictureModal) {
      const { data: { imgBase64Path } } = await this._modalService.displayPhotoUploadModal(true);
    
      if(imgBase64Path) {
        this.vendor.avatarSourceURL = imgBase64Path;
        this.vendor = await this._vendorSettings.uploadVendorLogo(imgBase64Path);
      }  
    }  
  }
}


