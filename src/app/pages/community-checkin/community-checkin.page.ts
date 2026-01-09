import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CheckinService } from 'src/app/services/checkin.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';

@Component({
  selector: 'app-community-checkin',
  templateUrl: './community-checkin.page.html',
  styleUrls: ['./community-checkin.page.scss'],
})
export class CommunityCheckinPage implements OnInit, OnDestroy {
  public networkId: string;
  public isProcessing: boolean = false;
  public hasNetworkId: boolean = false;
  public checkInAttempted: boolean = false;
  public checkInSucceeded: boolean = false;
  public checkInFailed: boolean = false;
  public errorMessage: string = '';
  private currentUser: CurrentUserDisplay;
  private userSubscription: Subscription;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _checkinService: CheckinService,
    private _accountsService: AccountsService,
    private _toastController: ToastController
  ) {
    const routeParams = this._activatedRoute.snapshot.paramMap;
    this.networkId = routeParams.get('networkId');

    if (this.networkId) {
      this.hasNetworkId = true;
    }

    this.userSubscription = this._accountsService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      if (user) {
        this.currentUser = user;

        // Only attempt check-in once per page load, and only when consumer data is fully loaded
        if (this.networkId && !this.isProcessing && !this.checkInAttempted && user.consumer?.id) {
          this.processCheckIn();
        }
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async processCheckIn() {
    this.checkInAttempted = true;

    // Double-check consumer data is available (should always be true if we got here correctly)
    if (!this.currentUser?.consumer?.id) {
      await this.showToast('Please log in to check in', 'warning');
      this._router.navigateByUrl('/home');
      return;
    }

    this.isProcessing = true;

    this._checkinService.createCommunityCheckIn(this.networkId, this.currentUser.consumer.id).subscribe({
      next: async (response) => {
        this.isProcessing = false;
        if (response.isSuccess) {
          this.checkInSucceeded = true;
          await this.showToast(`Checked in to ${response.networkName}!`, 'success');
        } else {
          this.checkInFailed = true;
          this.errorMessage = response.errors && response.errors.length > 0
            ? response.errors[0].errorMessage
            : 'Check-in failed';
          await this.showToast(this.errorMessage, 'danger');
        }
      },
      error: async (error) => {
        this.isProcessing = false;
        this.checkInFailed = true;

        if (error.error && error.error.errors && error.error.errors.length > 0) {
          this.errorMessage = error.error.errors[0].errorMessage;
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred during check-in';
        }

        await this.showToast(this.errorMessage, 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this._toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  goToFeed() {
    this._router.navigateByUrl('/feed');
  }
}
