import { Component, Input, OnInit } from '@angular/core';

import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';

@Component({
  selector: 'app-vendor-photos',
  templateUrl: './vendor-photos.component.html',
  styleUrls: ['./vendor-photos.component.scss'],
})
export class VendorPhotosComponent implements OnInit {

  @Input() vendor: VendorDisplay = null;
  @Input() maxPhotos: number = 4;

  public vendorPhotos = new Map<string, string>();
  // ==================================
  error: string;
  dragAreaClass: string;
  draggedFiles: any;
  // ======================
  
  constructor(private _accountsService: AccountsService, private _vendorSettings: VendorSettingsService, private _modalService: ModalService) {}

  ngOnInit() {
    this._loadPhotos(); 
  }

  private _loadPhotos() {
    for (let i = 0; i < this.maxPhotos; i++) {
      var key = i.toString();
      var value = this.vendor.photosDictionary[key];
      if(value){
        this.vendorPhotos.set(key, value);
      } else {
        this.vendorPhotos.set(key, null)
      }
    }
  }

  async showUploadPhotoModal(i: number) {
    const { data: { imgBase64Path } } = await this._modalService.displayPhotoUploadModal(false);
    if(imgBase64Path) {
      this.vendor = await this._vendorSettings.uploadPhoto(this.vendor.id, imgBase64Path, i);
      this._loadPhotos(); 
    }    
  }
}
