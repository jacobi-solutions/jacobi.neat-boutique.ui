import { Component, Inject, Input, OnInit } from '@angular/core';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { EditVendorExitCodes, VendorSettingsService } from 'src/app/services/vendor-settings.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-edit-bio',
  templateUrl: './edit-bio.component.html',
  styleUrls: ['../../vendor-settings.page.scss', './edit-bio.component.scss'],
})
export class EditBioComponent implements OnInit {

  @Input() vendor: VendorDisplay = null;
  public maxVendorDescriptionChars: number;
  public editDescription: boolean = false;
  public descriptionForm: UntypedFormGroup;

  constructor(private _modelService: ModalService, private _vendorSettings: VendorSettingsService) {

      this.maxVendorDescriptionChars = 700;
      
      this.descriptionForm = new UntypedFormGroup({
        description: new UntypedFormControl('', [ Validators.maxLength(this.maxVendorDescriptionChars)]),
      });
    }

  ngOnInit() {}

  public toggleEditDescription() {
    this.editDescription = !this.editDescription;
  }

  public async saveEditDescription() {
    this.editDescription = !this.editDescription;
    this.vendor = await this._vendorSettings.updateVendorDescription(this.vendor.id, this.descriptionForm.value.description)
  }


  public async editSocialMediaLinks() {
    const { data } = await this._modelService.displayEditSocialMediaModal(this.vendor);
    const { facebookURL, instagramURL, twitterURL } = data;
    this.vendor = await this._vendorSettings.updateVendorSocialLinks(this.vendor.id, facebookURL, instagramURL, twitterURL);
    console.log(this.vendor);
    
    return EditVendorExitCodes.SUCCESS;
  }

  

}