import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommunityCategory } from 'src/app/models/community-category';
import { CommunityService } from 'src/app/services/community.service';

@Component({
  selector: 'app-feed-settings-modal',
  templateUrl: './feed-settings-modal.component.html',
  styleUrls: ['./feed-settings-modal.component.scss'],
})
export class FeedSettingsModalComponent implements OnInit {
  communities: CommunityCategory[] = [];
  public userErrorMsg: string = null;

  constructor(private _modalController: ModalController, private _communityService: CommunityService) {
   
  }

  ngOnInit() {
    this.communities = this._communityService.communities;
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

 

  // public assessSelectedCommunities(event) {
  //   const userSelectedCommunities = Object.keys(this.communitySet).filter(communityName => {
  //     return this.communitySet[communityName].isSelected;
  //   })
  // }


  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      event,
    });
  }

  async onSave(event) {
    this._communityService.updateShownCommunities();
    

    this._modalController.dismiss({
      dismissed: true,
      event
    });
  }

}

