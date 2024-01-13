import { ComponentRef, Injectable } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { THEME } from "src/theme/theme-constants";
import { CurrentUserDisplay } from "../models/current-user-display";
import { UserRoleTypes } from "../models/constants";
import { ChooseAccountModalComponent } from "../shared/modals/choose-account-type-modal/choose-account-type-modal.component";
import { ConfirmationActionModalComponent } from "../shared/modals/confirmation-action-modal/confirmation-action-modal.component";
import { RequireLoginModalComponent } from "../shared/modals/require-login-modal/require-login-modal.component";
import { EditHeroImgAdModalComponent } from "../shared/modals/vendor-settings-modals/edit-hero-img-ad-modal/edit-hero-img-ad-modal.component";
import { EditSocialMediaLinksModalComponent } from "../shared/modals/vendor-settings-modals/edit-social-media-links-modal/edit-social-media-links-modal.component";
import { SelectCommunitiesModalComponent } from "../shared/modals/vendor-settings-modals/select-communities-modal/select-communities-modal.component";
import { UploadPhotoModalComponent } from "../shared/modals/upload-photo-modal/upload-photo-modal.component";
import { AccountsService } from "./accounts.service";
import { Selection, ConsumerProfile, VendorProfile } from "./neat-boutique-api.service";
import { ChangeAvatarModalComponent } from "../shared/modals/change-avatar-modal/change-avatar-modal.component";
import { LocationModalComponent } from "../shared/modals/location-modal/location-modal.component";
import { NotificationSettingsModalComponent } from "../shared/modals/notification-settings-modal/notification-settings-modal.component";
import { FeedSettingsModalComponent } from "../shared/modals/feed-settings-modal/feed-settings-modal.component";
import { ChooseAnswerRankingModalComponent } from "../shared/modals/choose-answer-ranking-modal/choose-answer-ranking-modal.component";
import { AnswerDisplay } from "../models/answer-display";
import { UsernameAndEmailModalComponent } from "../shared/modals/username-and-email-modal/username-and-email-modal.component";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private _currentUser: CurrentUserDisplay;

    constructor(private _modalController: ModalController, private _customersService: AccountsService) {
      this._customersService.currentUserSubject.subscribe(user => {
          this._currentUser = user;        
      });
    }

    async displayRequireLoginModal(): Promise<HTMLIonModalElement> {
      const modalHandle = await this._modalController.create({
        component: RequireLoginModalComponent,
        cssClass: 'custom-modal require-login-warning-modal',
      });
      modalHandle.present();
      return modalHandle;
    }

    async displayConfirmActionModal(confirmationInnerHTML: string, confirmButton: {label: string, callback: Function}, showCancel: boolean = true): Promise<HTMLIonModalElement> {

      const modalHandle = await this._modalController.create({
        component: ConfirmationActionModalComponent,
        componentProps: { confirmationInnerHTML, confirmButton, showCancel },
        cssClass: 'custom-modal confirm-action-warning-modal',
      });
      modalHandle.present();
      return modalHandle;
    }

  //   modals: {
  //     cssBase: 'custom-modal',
  //     requireLogin: {
  //         cssClass: 'require-login-warning-modal',
  //     },
  //     confirmActionWarning: {
  //         cssClass: 'confirm-action-warning-modal',
  //     },
  //     chooseAccountType: {
  //         cssClass: 'choose-account-type-modal',
  //     },
  // },


    async displayChooseProfileModal(): Promise<{ accountRole: string, user: ConsumerProfile | VendorProfile }> {
      if(this._currentUser?.vendors?.length > 0) {
        const modal = await this._chooseAccountModal();
        const { data: { accountRole, user} } = await modal.onDidDismiss();
        return { accountRole, user };
      }
      return {
        accountRole: UserRoleTypes.CONSUMER,
        user: this._currentUser?.consumer
      };
    }

    private async _chooseAccountModal(): Promise<HTMLIonModalElement> {
      const modalHandle = await this._modalController.create({
        component: ChooseAccountModalComponent,
        cssClass: 'custom-modal choose-account-type-modal',
      });
      modalHandle.present();
      return modalHandle;
    }

    async displayChooseAnswerRankingModal(answer: AnswerDisplay, answers: AnswerDisplay[]) {
      const modal = await this._modalController.create({
        component: ChooseAnswerRankingModalComponent,
        cssClass: 'custom-modal choose-answer-ranking-modal',
        componentProps: { answer: answer, answers: answers }
      });
      modal.present();
      const { data: { choice, answerToRemove } } = await modal.onDidDismiss();
      return { choice, answerToRemove };
    }


  async displayEditCommunitiesModal(vendorCommunities: string[]) {
    const modalHandle = await this._modalController.create({
      component: SelectCommunitiesModalComponent,
      componentProps: { vendorCommunities },
      cssClass: 'custom-modal confirm-action-warning-modal vendor-settings-edit-communities',
    });
    modalHandle.present();

    // data to return when closed. Data is determined in the component used for the modal
    const { data } = await modalHandle.onDidDismiss();

    return {
      data: data?.communitySet || null
    };
  }

  async displayEditNotificationCategoriesModal(notificationCategories: string[], notificationsForAnsweredQuestions: boolean) {
    const modalHandle = await this._modalController.create({
      component: NotificationSettingsModalComponent,
      componentProps: { notificationCategories, notificationsForAnsweredQuestions },
      cssClass: 'custom-modal confirm-action-warning-modal notification-category-selection',
    });
    modalHandle.present();

    // data to return when closed. Data is determined in the component used for the modal
    const { data } = await modalHandle.onDidDismiss();

    return {
      data: data?.communitySet || null
    };
  }

  async displayEditFeedSettingsModal(feedCategoriesToShow: string[]) {
    const modalHandle = await this._modalController.create({
      component: FeedSettingsModalComponent,
      componentProps: { feedCategoriesToShow },
      cssClass: 'custom-modal confirm-action-warning-modal notification-category-selection',
    });
    modalHandle.present();

    // data to return when closed. Data is determined in the component used for the modal
    const { data } = await modalHandle.onDidDismiss();

    return {
      data: data?.communitySet || null
    };
  }

  async displayEditSocialMediaModal(vendor: VendorProfile) {
    const modalHandle = await this._modalController.create({
      component: EditSocialMediaLinksModalComponent,
      componentProps: { vendor: vendor },
      cssClass: 'custom-modal confirm-action-warning-modal',
    });
    modalHandle.present();

    // data to return when closed. Data is determined in the component used for the modal
    const { data } = await modalHandle.onDidDismiss();

    return {
      data: data?.socialMediaUrls || null
    };
  }

  async displayUsernameAndEmailModal() {
    const modalHandle = await this._modalController.create({
      component: UsernameAndEmailModalComponent,
      componentProps: {  },
      cssClass: 'custom-modal confirm-action-warning-modal',
    });
    modalHandle.present();

    // data to return when closed. Data is determined in the component used for the modal
    const { data: { username } } = await modalHandle.onDidDismiss();
    
    return { username };
  }


  async displayPhotoUploadModal(isCircular: boolean) {
    const modalHandle = await this._modalController.create({
      component: UploadPhotoModalComponent,
      componentProps: { isCircular: isCircular },
      cssClass: 'custom-modal upload-photo-modal',
    });
    modalHandle.present();

    const { data } = await modalHandle.onDidDismiss();

    return {
      data: { ...data },
    };
  }

  async displayChangeAvatarModal(profile: ConsumerProfile | VendorProfile) {
    const modalHandle = await this._modalController.create({
      component: ChangeAvatarModalComponent,
      componentProps: { profile: profile },
      cssClass: 'custom-modal change-avatar-modal',
    });
    modalHandle.present();

    const { data } = await modalHandle.onDidDismiss();

    return {
      data: { ...data },
    };
  }

  async displayLocationModal() {
    const modalHandle = await this._modalController.create({
      component: LocationModalComponent,
      cssClass: 'custom-modal',
    });
    modalHandle.present();

    const { data } = await modalHandle.onDidDismiss();

    return {
      data: { ...data },
    };
  }

 
}