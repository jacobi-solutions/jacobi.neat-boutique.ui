import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { Platform, PopoverController } from '@ionic/angular';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { VendorSubscriptionPackage, VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
import { PopoverItem } from '../types/popover-types';
import { AuthService } from 'src/app/auth/auth.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-user-settings-popover',
  templateUrl: './user-settings-popover.component.html',
  styleUrls: ['./user-settings-popover.component.scss'],
})
export class UserSettingsPopoverComponent implements OnInit {

  public popoverItems: PopoverItem[] = [];
  public currentUser: CurrentUserDisplay = null;
  public promoteMyBusinessLabel = 'Promote My Business';
  public showPromoteMyBusinessLabel = false;
  private _postNoticeModal: HTMLIonModalElement;

  constructor(private _accountsService: AccountsService, private _popoverController: PopoverController, private _authService: AuthService,
    private _accountServices: AccountsService, private _modalService: ModalService, private _router: Router,
    private _platform: Platform, private _vendorSubscriptionService: VendorSubscriptionService) {
      

    if (!this._platform.is("capacitor")) {
      this.showPromoteMyBusinessLabel = true;
      this._accountsService.currentUserSubject.subscribe((user) => {
        if(user) {
          this.currentUser = user;
          if(this.currentUser?.vendors?.length === 1) {
            this.promoteMyBusinessLabel = 'Manage My Business';
          } else if(this.currentUser?.vendors?.length > 1) {
            this.promoteMyBusinessLabel = 'Manage My Businesses';
          }
        }
      });
    }
    
    var self = this;
    this.popoverItems = [
      {
        label: "My Profile",
        isClickable: true,
        url: '',
        callback(event) {
          self._router.navigateByUrl('/settings');
          self._popoverController.dismiss();
        }
      },
      {
        label: "Change Email",
        isClickable: true,
        callback(event) {          
          self._router.navigateByUrl('/auth-flow/change-email-init');
          self._popoverController.dismiss();
        }
      },
      {
        label: "Change Password",
        isClickable: true,
        url: '',
        callback(event) {
          self._router.navigateByUrl('/auth-flow/change-password-init');
          self._popoverController.dismiss();
        }
      },
      
      
      // {
      //   label: "My Lists",
      //   isClickable: true,
      //   url: '',
      //   callback(event) {
      //     self._router.navigateByUrl('/my-list');
      //     self._popoverController.dismiss();
      //   }
      // },
      // {
      //   label: "My Questions",
      //   isClickable: true,
      //   url: '',
      //   callback(event) {
      //     self._router.navigateByUrl('/my-questions');
      //     self._popoverController.dismiss();
      //   }
      // },
      {
        label: "Connect sign in methods",
        isClickable: true,
        url: '/auth-flow/link-sign-in-methods',
        callback(event) {
          self._router.navigateByUrl('/auth-flow/link-sign-in-methods');
          self._popoverController.dismiss();
        }
      },
      {
        label: "Contact Loci",
        isClickable: true,
        url: '',
        callback(event) {
          self._popoverController.dismiss();
        }
      },
      {
        label: "Delete Account",
        isClickable: true,
        callback(event) {
          if(self.currentUser.vendors.length === 1) {
            self.confirmCancelSubscription(self.currentUser.vendors[0]);
          } else if(self.currentUser.vendors.length > 1) {
            self.confirmCancelSubscriptions();
          } else {
            self._router.navigateByUrl('/auth-flow/delete-account-init');
          }
          self._popoverController.dismiss();
        }
      },
      {
        label: "Sign Out",
        isClickable: true,
        url: '',
        async callback(event) {
          // firebase user
          await self._authService.signOut();
          // user used in components 
          self._accountServices.unLoadAccounts();
          self._router.navigateByUrl('/auth-flow/sign-in');
          self._popoverController.dismiss();
        }
      }
    ];

    if(this.showPromoteMyBusinessLabel) {
      var promoteMyBussinessPopoverItem = {
        label: this.promoteMyBusinessLabel,
        cssClass: 'cta-btn',
        isClickable: true,
        url: '/vendor-settings',
        callback(event) {
          self._popoverController.dismiss();  
          if(self.currentUser.vendors.length === 1) {
            self._router.navigateByUrl('/vendor-settings', { state: self.currentUser.vendors[0] });
          } else if(self.currentUser.vendors.length > 1) {
            self._router.navigateByUrl('/vendor-businesses');
          } else {
            self._router.navigateByUrl('/pricing');
          }
        }
      };
      this.popoverItems.push(promoteMyBussinessPopoverItem);
    }
      
    var addedFeedSettings = false;
    if(_platform.width() < 992) {
      var popoverItem = {
        label: "Feed Settings",
        isClickable: true,
        url: '',
        callback(event) {
            self._modalService.displayEditFeedSettingsModal(self.currentUser?.feedCategoriesToShow);
            self._popoverController.dismiss();
        }
      };
      addedFeedSettings = true;
      this.popoverItems.splice(3, 0, popoverItem);
    }

    if(Capacitor.getPlatform() !== 'web') {
      var popoverItem = {
        label: "Notification Settings",
        isClickable: true,
        url: '',
        callback(event) {
            self._modalService.displayEditNotificationCategoriesModal(self.currentUser?.notificationCategories || [], self.currentUser?.consumer.notificationsForAnsweredQuestions);
            self._popoverController.dismiss();
        }
      };
      var notificationFeedSettingsIndex = addedFeedSettings ? 4 : 3;
      this.popoverItems.splice(notificationFeedSettingsIndex, 0, popoverItem);
    }

  }

  async confirmCancelSubscription(vendor: VendorProfile) {
    const self = this;
    const showCancelBtn = true;
    const html = `
      <h1>Sorry to see you go.</h1>
      <p class="text-left-align modal-p-min">
      Before you can delete your account, you must first cancel your Vendor Subscription. Would you like to do that?
      </p>
    `;

    const confirmBtn = {
      label: 'Cancel Subscription',
      // callback: this.addNewPost
      callback() {
        // self.userHasSeenNonEditableModal = true;
        // self._communityService.userHasSeenNonEditableModal = true;
        self._vendorSubscriptionService.startVendorSubscriptionCancelation(vendor);
        self._postNoticeModal.dismiss();
      }
    };

    this._postNoticeModal = await this._modalService.displayConfirmActionModal(html, confirmBtn, showCancelBtn);
  }

  async confirmCancelSubscriptions() {
    const self = this;
    const showCancelBtn = true;
    const html = `
      <h1>Sorry to see you go.</h1>
      <p class="text-left-align modal-p-min">
        Before you can delete your account, you must first cancel your Vendor Subscriptions. To do that, go to your businesses management page.
      </p>
    `;

    const confirmBtn = {
      label: 'Manage my Businesses',
      // callback: this.addNewPost
      callback() {
        // self.userHasSeenNonEditableModal = true;
        // self._communityService.userHasSeenNonEditableModal = true;
        // self._vendorSubscriptionService.startVendorSubscriptionCancelation(self.currentUser.vendor);
        self._router.navigateByUrl('/vendor-businesses');
        self._postNoticeModal.dismiss();
      }
    };

    this._postNoticeModal = await this._modalService.displayConfirmActionModal(html, confirmBtn, showCancelBtn);
  }

  ngOnInit() {
    this._accountsService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
        this.currentUser = user;
    });
  }
}
