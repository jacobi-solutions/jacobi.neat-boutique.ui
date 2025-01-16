import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { UserRoleTypes } from 'src/app/constants/user-role-types';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerProfile, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorDisplay } from 'src/app/models/vendor-display';

@Component({
  selector: 'app-choose-account-type-modal-modal',
  templateUrl: './choose-account-type-modal.component.html',
  styleUrls: ['./choose-account-type-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class ChooseAccountModalComponent implements OnInit {
  @Input() noticeInnerHTML: Function;

  currentUser: CurrentUserDisplay = null;

  constructor(private _modalController: ModalController, private _customersService: AccountsService) {}
    

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    // dynamically set modal height based on content height
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);

    this._customersService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this.currentUser = user;
      
    });
  }

  onClose() {
    this._modalController.dismiss({
      canceled: true,
    });
  }

  getConsumerProfile() {
    if(this.currentUser) {
      this._modalController.dismiss({
        canceled: false,
        accountRole: UserRoleTypes.CONSUMER,
        user: this.currentUser?.consumer,
      });
    }
  }

  getVendorProfile(vendor: VendorProfile) {
    if(this.currentUser) {
      this._modalController.dismiss({
        canceled: false,
        accountRole: UserRoleTypes.VENDOR,
        user: vendor,
      });
    }
  }
}
