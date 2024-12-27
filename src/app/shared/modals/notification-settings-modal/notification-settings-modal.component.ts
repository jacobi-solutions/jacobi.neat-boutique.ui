import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CategoryTypes } from 'src/app/models/constants';
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
  public categoryTypes: string[];
  public categorySet: { name: string, isSelected: boolean}[] = [];
  public userErrorMsg: string = null;

  constructor(private _modalController: ModalController, private _accountsService: AccountsService, private _notificationService: NotificationsService) {
    this.categoryTypes = Object.keys(CategoryTypes).map(key => CategoryTypes[key]);

    
  }

  ngOnInit() {
    this.categoryTypes.forEach(x => {
      var isSelected = this.notificationCategories.includes(x);
      this.categorySet.push({name: x, isSelected: isSelected})
    });
    
    
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

 

  public assessSelectedCategories(event) {
    const userSelectedCategories = Object.keys(this.categorySet).filter(categoryName => {
      return this.categorySet[categoryName].isSelected;
    })
  }


  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      event,
    });
  }

  async onSave(event) {
    const selectedCategories = this.categorySet.filter(x => x.isSelected)
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
