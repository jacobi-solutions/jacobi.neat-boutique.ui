import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-edit-social-media-links-modal',
  templateUrl: './edit-social-media-links-modal.component.html',
  styleUrls: ['./edit-social-media-links-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditSocialMediaLinksModalComponent implements OnInit {
  
  @Input() vendor: VendorProfile;
  
  public socialMediaUrls: [string, string][];
  public socialMediaForm: UntypedFormGroup;

  constructor(private _modalController: ModalController) {}

  ngOnInit() {
    this.socialMediaUrls = [
      ['facebookURL',   (this.vendor?.facebookURL)  ? this.vendor?.facebookURL  : null],
      ['instagramURL',  (this.vendor?.instagramURL) ? this.vendor?.instagramURL : null],
      ['twitterURL',    (this.vendor?.twitterURL)   ? this.vendor?.twitterURL   : null],
    ]

    let fields = {};
    this.socialMediaUrls.forEach(([social, link]) => {
      if(!fields.hasOwnProperty(social)) {
        fields[social] = new UntypedFormControl('', []);
      }
    });

    this.socialMediaForm = new UntypedFormGroup(fields);    
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

  public prettyLabelNames(label: string) {
    return [...label].map((char, i, charSet) => {
      if(i === 0) {
        return char.toUpperCase();
      } else if((char === char.toUpperCase()) && (charSet[i-1] === charSet[i-1].toLowerCase())) {
        return ' ' + char;
      }
      return char;
    }).join('');
  }

  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      socialMediaUrls: null,
      event,
    });
  }

  onSave(event) {
    this._modalController.dismiss({
      dismissed: true,
      socialMediaUrls: this.socialMediaForm.value,
      event,
    });
  }

}
