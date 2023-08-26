import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { AuthService } from '../auth/auth.service';

import { CurrentUserDisplay } from '../models/current-user-display';
import {
  NeatBoutiqueApiService,
  Request,
  ConsumerProfile,
  VendorProfile,
  ProfilesResponse,
  VendorProfileResponse,
  GooglePlacesEntity,
  AccountDeletionRequest,
  ChangeVendorSubscriptionRequest,
  ConsumerFeedSettingsRequest,
  ConsumerNotificationSettingsRequest,
  ConsumerProfileResponse,
  NotificationTokenRequest,
  Response,
  AccountCreateRequest,
  VendorProfileCancelRequest
} from './neat-boutique-api.service';
import { Router, UrlTree } from '@angular/router';
import { VendorSubscriptionPackage } from './vendor-subscription.service';
import { AccountDeletion, AuthService } from '../auth/auth.service';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private _currentUser: CurrentUserDisplay;
  public accountsHaveBeenLoadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public currentUserSubject: BehaviorSubject<CurrentUserDisplay> = new BehaviorSubject<CurrentUserDisplay>(null);
  
  constructor(private _neatBoutiqueApiService: NeatBoutiqueApiService) {

  }

  createAccount(googleAuthId: string, username: string, email: string) {
    const request = new AccountCreateRequest();
    request.googleAuthUserId = googleAuthId;
    request.username = username;
    request.email = email;
    const promise = new Promise((resolve, reqject) => {
      this._neatBoutiqueApiService.createAccount(request).subscribe((response) => {
        if(response.isSuccess) {
          
          this._currentUser = new CurrentUserDisplay(response.consumerProfile, response.vendorProfiles);
          this._currentUser.feedCategoriesToShow = response.feedCategoriesToShow;
          this._currentUser.notificationCategories = response.notificationCategories;
          this._currentUser.notificationsForAnsweredQuestions = response.notificationsForAnsweredQuestions;
          this.currentUserSubject.next(this._currentUser);
          this.accountsHaveBeenLoadedSubject.next(true);

          if(!this._currentUser.consumer.name || !this._currentUser.consumer.email) {
            this._promptUserForNameAndEmail();
          }
          resolve(true);
        }
      });
    });
    return promise;
  }
  deleteAuthUserInit(accountDeletion: AccountDeletion) {
    const request = new AccountDeletionRequest();
    request.token = accountDeletion.token;
    request.userId = accountDeletion.userId;
    const promise = new Promise((resolve, reqject) => {
      this._neatBoutiqueApiService.deleteAccountInit(request).subscribe();
    });
  }

  deleteAuthUserFinal(accountDeletion: AccountDeletion) {
    const request = new AccountDeletionRequest();
    request.token = accountDeletion.token;
    request.userId = accountDeletion.userId;
    const promise = new Promise((resolve, reqject) => {
      this._neatBoutiqueApiService.deleteAccountFinal(request).subscribe();
    });
  }

  deleteAccountRollBack(accountDeletion: AccountDeletion) {
    const request = new AccountDeletionRequest();
    request.token = accountDeletion.token;
    request.userId = accountDeletion.userId;
    const promise = new Promise((resolve, reqject) => {
      this._neatBoutiqueApiService.deleteAccountRollBack(request).subscribe();
    });
  }

  private _updateEmail() {
    const request = new Request();

    const promise = new Promise((resolve, reject) => {
      this._neatBoutiqueApiService.updateEmail(request).subscribe((response: ProfilesResponse) => {
        if (response.isSuccess) {
          // this._setCurrentUser(response.consumerProfile, response.vendorProfile);
          
          resolve(true);
        }
        else {
          // this.authService.revokeToken();
          reject(false);
        }
      });
    });
    return promise;
  }

  preloadConsumerProfile(user: User) { 
    if(user?.displayName && !this._currentUser) {    
      var consumerProfile = new ConsumerProfile();
      consumerProfile.name = user.displayName;
      consumerProfile.avatarSourceURL = user.photoURL;    
      this._setCurrentUser(consumerProfile, null);
    }   
    
  }

  public unLoadAccounts() {
    this._currentUser = null;
    this.currentUserSubject.next(null);
  }

  loadAccounts() {
    const request = new Request();
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.getAccounts(request).subscribe((response: ProfilesResponse) => {
        if (response.isSuccess) {
          if(this._currentUser?.consumer) {
            response.consumerProfile.name = this._currentUser?.consumer.name;
          }
          this._currentUser = new CurrentUserDisplay(response.consumerProfile, response.vendorProfiles);
          this._currentUser.isAdmin = response.isAdmin;
          this._currentUser.feedCategoriesToShow = response.feedCategoriesToShow;
          this._currentUser.notificationCategories = response.notificationCategories;
          this._currentUser.notificationsForAnsweredQuestions = response.notificationsForAnsweredQuestions;
          this.currentUserSubject.next(this._currentUser);
          this.accountsHaveBeenLoadedSubject.next(true);
          if(!this._currentUser.consumer.name || !this._currentUser.consumer.email) {
            this._promptUserForNameAndEmail();
          }
          resolve(true);
        }
        else {
          reject(false);
        }
      });
    });
    return promise;
  }


  private _promptUserForNameAndEmail() {

  }
  private _setCurrentUser(consumer: ConsumerProfile, vendors: VendorProfile[]) {    
    // preserve consumer name from Firebase User
    if(this._currentUser?.consumer) {
      consumer.name = this._currentUser?.consumer.name;
    }

    this._currentUser = new CurrentUserDisplay(consumer, vendors);
    this.currentUserSubject.next(this._currentUser);
  }

  public setCurrentConsumer(consumer: ConsumerProfile) {
    var promise = new Promise<boolean>((resolve, reject) => {
      this._setCurrentUser(consumer, this._currentUser?.vendors);
      resolve(true);
    });
    return promise;
  } 

  public setCurrentVendors(vendors: VendorProfile[]) {
    var promise = new Promise<boolean>((resolve, reject) => {
      this._setCurrentUser(this._currentUser?.consumer, vendors);
      resolve(true);
    });
    return promise;
  }

  public getCurrentUser() {
    return this._currentUser;
  }

  updateUsername(username: string) {
    this._currentUser.consumer.name = username;
    this._setCurrentUser(this._currentUser.consumer, this._currentUser.vendors)
    
    this._neatBoutiqueApiService.updateUsername(new Request());
  }


  // connectVendor(payPalSubscriptionId: string, payPalPlanId: string, googlePlace: GooglePlacesEntity, vendor: VendorProfile) {
  //   const request = new UpgradeToVendorRequest();
  //   request.vendorSubscriptionPayPalId = payPalSubscriptionId;
  //   request.googlePlace = googlePlace;
  //   request.vendorProfile = vendor;
  //   request.vendorPayPalPlanId = payPalPlanId;
  //   const promise = new Promise<boolean>((resolve, reject) => {
  //     this._neatBoutiqueApiService
  //       .upgradeToVendor(request)
  //       .subscribe((response: VendorProfileResponse) => {
  //         if (response.isSuccess) {
  //           this.setCurrentVendor(response.vendorProfile).then(() => {
  //             resolve(true);
  //           });
  //         } else if (response.errors.find((x) => x.errorCode === "409")) {
  //           reject();
  //         }
  //       });
  //     });
  //     return promise;
  // }

  cancelVendorSubscription(vendorId: string) {
    const request = new VendorProfileCancelRequest();
    request.vendorProfileId = vendorId;
    
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService
        .cancelVendorSubscription(request)
        .subscribe((response: VendorProfileResponse) => {
          if (response.isSuccess) {
            var currentVendors = this._currentUser.vendors.filter(x => x.id !== vendorId)
            this.setCurrentVendors(currentVendors).then(() => {
              resolve(true);
            });
          } else if (response.errors.find((x) => x.errorCode === "409")) {
            reject();
          }
        });
      });
      return promise;
  }


  changeVendorSubscriptionToPremium(vendorId: string, vendorPackage: VendorSubscriptionPackage) {
    const request = new ChangeVendorSubscriptionRequest();
    request.vendorProfileId = vendorId;
    request.stripePriceId = vendorPackage.stripePriceId;
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService
        .changeVendorSubscriptionToPremium(request)
        .subscribe((response: VendorProfileResponse) => {
          if (response.isSuccess) {
              var currentVendors = this._currentUser.vendors.filter(x => x.id !== vendorId)
              currentVendors = [ response.vendorProfile, ...currentVendors]
              this.setCurrentVendors(currentVendors);
              resolve(true);
          } else if (response.errors.find((x) => x.errorCode === "420")) {
            reject();
          }
        });
      });
      return promise;
  }

  changeVendorSubscriptionToStandard(vendorId: string, vendorPackage: VendorSubscriptionPackage) {
    const request = new ChangeVendorSubscriptionRequest();
    request.vendorProfileId = vendorId;
    request.stripePriceId = vendorPackage.stripePriceId;
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService
        .changeVendorSubscriptionToStandard(request)
        .subscribe((response: VendorProfileResponse) => {
          if (response.isSuccess) {
            var currentVendors = this._currentUser.vendors.filter(x => x.id !== vendorId)
            currentVendors = [ response.vendorProfile, ...currentVendors]
            this.setCurrentVendors(currentVendors);
              resolve(true);
          } else if (response.errors.find((x) => x.errorCode === "420")) {
            reject();
          }
        });
      });
      return promise;
  }

  public updateNotificationSettings(token: string, categories: string[], notificationsForAnsweredQuestions) {
    var request = new ConsumerNotificationSettingsRequest();
    request.notificationToken = token;
    request.notificationCategories = categories;
    request.notificationsForAnsweredQuestions = notificationsForAnsweredQuestions;

    console.log("updating notification settings: ")
    console.log(categories);
    const promise = new Promise<ConsumerProfile>((resolve, reject) => {
      this._neatBoutiqueApiService.updateNotificationSettings(request).subscribe((response: ConsumerProfileResponse) => {
        if (response.isSuccess) {
          this.setCurrentConsumer(response.consumerProfile);
          console.log("notification settings updated")
          resolve(response.consumerProfile);
        }
      });
    });

    return promise;
  }

  public updateNotificationToken(token: string) {
    var request = new NotificationTokenRequest();
    request.notificationToken = token;

    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.updateAccountNotificationToken(request).subscribe((response: Response) => {
        if (response.isSuccess) {
          resolve(true);
        }
      });
    });

    return promise;
  }


  public updateFeedSettings(categories: string[]) {
    var request = new ConsumerFeedSettingsRequest();
    request.feedCategoriesToShow = categories;
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.updateAccountFeedSettings(request).subscribe((response: Response) => {
        if (response.isSuccess) {
          resolve(true);
        }
      });
    });

    return promise;
  }
}
