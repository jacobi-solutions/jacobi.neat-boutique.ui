import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CheckinService } from 'src/app/services/checkin.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.page.html',
  styleUrls: ['./checkin.page.scss'],
})
export class CheckinPage implements OnInit {
  public vendorId: string;
  public isProcessing: boolean = false;
  public hasVendorId: boolean = false;
  private currentUser: CurrentUserDisplay;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _checkinService: CheckinService,
    private _accountsService: AccountsService,
    private _toastController: ToastController
  ) {
    // Get vendorId from route params first
    const routeParams = this._activatedRoute.snapshot.paramMap;
    this.vendorId = routeParams.get('vendorId');

    if (this.vendorId) {
      this.hasVendorId = true;
    }

    // Get current user and process check-in when user is available
    this._accountsService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      if (user) {
        this.currentUser = user;

        // If we have a vendorId and user is now loaded, process the check-in
        if (this.vendorId && !this.isProcessing) {
          this.processCheckIn();
        }
      }
    });
  }

  ngOnInit() {
    // Logic moved to constructor subscription
  }

  async processCheckIn() {
    if (!this.currentUser || !this.currentUser.consumer) {
      // User is not logged in (auth guard should have caught this, but double check)
      await this.showToast('Please log in to check in', 'warning');
      this._router.navigateByUrl('/home');
      return;
    }

    this.isProcessing = true;

    try {
      // Call check-in API
      this._checkinService.createCheckIn(this.vendorId, this.currentUser.consumer.id).subscribe({
        next: async (response) => {
          if (response.isSuccess) {
            await this.showToast(`Checked in to ${response.vendorName}!`, 'success');
            // Navigate to feed
            this._router.navigateByUrl('/feed');
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

          // Try to extract error message from API response
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
