import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.page.html',
  styleUrls: ['./my-list.page.scss'],
})
export class MyListPage implements OnInit {

  public pageName: string = 'My List';
  public vendors: VendorDisplay[] = [];

  private _currentUser: CurrentUserDisplay;

  constructor(private _consumerActionService: ConsumerService, private _router: Router, private _accountService: AccountsService) { }

  ngOnInit() {
      this._accountService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
        this._currentUser = currentUser;
        this._loadVendors()
      });
  }

  private async  _loadVendors() {
    this._consumerActionService.getVendorProfilesForMyPlaces();
    this._consumerActionService.vendorsInMyListSubject.subscribe((vendors: VendorDisplay[]) => {
      this.vendors = vendors;
    });

    // this.vendors = await this._consumerActionService.getVendorProfilesForMyPlaces();
  }



  public goToVendorProfile(vendor: VendorDisplay) {
    const navExtras: NavigationExtras = { state: { vendor } };
    this._router.navigate(['/vendor-profile'], navExtras);
  }

}
