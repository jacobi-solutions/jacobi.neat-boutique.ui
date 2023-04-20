import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';

@Component({
  selector: 'app-edit-hero-img-ad-modal',
  templateUrl: './edit-hero-img-ad-modal.component.html',
  styleUrls: ['./edit-hero-img-ad-modal.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class EditHeroImgAdModalComponent implements OnInit {

  @Input() vendor: VendorProfile;

  public communityTaglines: {}[];
  public communityHeroImages: {}[];

  public heroAdForm = new UntypedFormGroup({
    communityHeroImage: new UntypedFormControl('', [Validators.required]),
    communityTagline: new UntypedFormControl('', [Validators.required]),
    vendorTagline: new UntypedFormControl('', [Validators.required]),
  }); 

  constructor(private _modalController: ModalController, private _vendorSettings: VendorSettingsService) {
    this.communityHeroImages = this._vendorSettings.getCommunityImages();
    this.communityTaglines = this._vendorSettings.getCommunityTaglines();
  }

  ngOnInit() {}

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      heroAd: null,
      event,
    });
  }

  onSave(event) {
    this._modalController.dismiss({
      dismissed: true,
      heroAd: this.heroAdForm.value,
      event,
    });
  }
}
