import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommunityTypes } from 'src/app/models/constants';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';

@Component({
  selector: 'app-select-communities-modal',
  templateUrl: './select-communities-modal.component.html',
  styleUrls: ['./select-communities-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SelectCommunitiesModalComponent implements OnInit {

  @Input() vendorCommunities: string[] = [];
  public communityTypes: string[];
  public communitySet: {};
  public userErrorMsg: string = null;

  constructor(private _modalController: ModalController, private _vendorSettings: VendorSettingsService) {
    this.communityTypes = Object.keys(CommunityTypes).map(key => CommunityTypes[key]);

    
  }

  ngOnInit() {
    this.communitySet = this.communitySet || {};
    this.communityTypes.forEach(community => {
      if(!this.communitySet.hasOwnProperty(community)) {
        this.communitySet[community] = {
          isSelected: this.vendorCommunities.includes(community),
        };
      }
    });
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

  public vendorInCommunity(community: string) {
    return this.vendorCommunities.includes(community);
  }

  public assessSelectedCommunities(event) {
    const userSelectedCommunities = Object.keys(this.communitySet).filter(communityName => {
      return this.communitySet[communityName].isSelected;
    })

    if(userSelectedCommunities?.length === 0) {
      this.userErrorMsg = 'At least one community needs to be selected.';
    } else {
      this.userErrorMsg = null;
    }
  }


  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      communitySet: null,
      event,
    });
  }

  onSave(event) {
    const communityArray = Object.keys(this.communitySet)
      .map(comm => {
        if(this.communitySet[comm].isSelected) {
          return comm
        }
        return false
      }).filter(comm => comm);

    if(communityArray?.length === 0) {
      this._modalController.dismiss({
        dismissed: true,
        communitySet: this.vendorCommunities,
        event,
      });
    }

    this._modalController.dismiss({
      dismissed: true,
      communitySet: communityArray,
      event,
    });

    // this._vendorSettings.updateVendorCommunities();

    // updateVendorCommunities
  }

}
