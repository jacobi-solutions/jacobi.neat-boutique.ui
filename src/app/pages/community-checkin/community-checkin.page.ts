import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CheckinService } from 'src/app/services/checkin.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';

@Component({
  selector: 'app-community-checkin',
  templateUrl: './community-checkin.page.html',
  styleUrls: ['./community-checkin.page.scss'],
})
export class CommunityCheckinPage implements OnInit {
  public networkId: string;
  public isProcessing: boolean = false;
  public hasNetworkId: boolean = false;
  public checkInAttempted: boolean = false;
  private currentUser: CurrentUserDisplay;

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

    this._accountsService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      if (user) {
        this.currentUser = user;

        // Only attempt check-in once per page load
        if (this.networkId && !this.isProcessing && !this.checkInAttempted) {
          this.processCheckIn();
        }
      }
    });
  }

  ngOnInit() {}

  async processCheckIn() {
    this.checkInAttempted = true;

    if (!this.currentUser || !this.currentUser.consumer) {
      await this.showToast('Please log in to check in', 'warning');
      this._router.navigateByUrl('/home');
      return;
    }

    this.isProcessing = true;

    try {
      this._checkinService.createCommunityCheckIn(this.networkId, this.currentUser.consumer.id).subscribe({
        next: async (response) => {
          if (response.isSuccess) {
            await this.showToast(`Checked in to ${response.networkName}!`, 'success');
          } else {
            const errorMessage = response.errors && response.errors.length > 0
              ? response.errors[0].errorMessage
              : 'Check-in failed';
            await this.showToast(errorMessage, 'danger');
          }
          this.isProcessing = false;
        },
        error: async (error) => {
          let errorMessage = 'An error occurred during check-in';

          if (error.error && error.error.errors && error.error.errors.length > 0) {
            errorMessage = error.error.errors[0].errorMessage;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }

          await this.showToast(errorMessage, 'danger');
          this.isProcessing = false;
        }
      });
    } catch (error) {
      await this.showToast('An error occurred during check-in', 'danger');
      this.isProcessing = false;
    }
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
