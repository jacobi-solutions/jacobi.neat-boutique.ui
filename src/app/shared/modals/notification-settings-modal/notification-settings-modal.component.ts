import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommunityTypes } from 'src/app/models/constants';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { NotificationsService } from 'src/app/services/notifications.service';

@Component({
  selector: 'app-notification-settings-modal',
  templateUrl: './notification-settings-modal.component.html',
  styleUrls: ['./notification-settings-modal.component.scss'],
})
export class NotificationSettingsModalComponent implements OnInit {

  @Input() notificationCategories: string[] = [];
  @Input() notificationsForAnsweredQuestions: boolean;
  public communityTypes: string[];
  public communitySet: { name: string, isSelected: boolean}[] = [];
  public userErrorMsg: string = null;

  constructor(private _modalController: ModalController, private _accountsService: AccountsService, private _notificationService: NotificationsService) {
    this.communityTypes = Object.keys(CommunityTypes).map(key => CommunityTypes[key]);

    
  }

  ngOnInit() {
    this.communityTypes.forEach(x => {
      var isSelected = this.notificationCategories.includes(x);
      this.communitySet.push({name: x, isSelected: isSelected})
    });
    
    
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

 

  public assessSelectedCommunities(event) {
    const userSelectedCommunities = Object.keys(this.communitySet).filter(communityName => {
      return this.communitySet[communityName].isSelected;
    })
  }


  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      event,
    });
  }

  async onSave(event) {
    const selectedCategories = this.communitySet.filter(x => x.isSelected)
      .map(y => y.name);

    var token = await this._notificationService.getToken();
    if(token) {
      this._accountsService.updateNotificationSettings(token, selectedCategories, this.notificationsForAnsweredQuestions);
    }
      

    this._modalController.dismiss({
      dismissed: true,
      event
    });
  }

}
