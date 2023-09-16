import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-vendor-businesses',
  templateUrl: './vendor-businesses.page.html',
  styleUrls: ['./vendor-businesses.page.scss'],
})
export class VendorBusinessesPage implements OnInit {
  currentUserDisplay: CurrentUserDisplay;

  constructor(private _router: Router, private _accountsService: AccountsService, private _vendorSubscriptionService: VendorSubscriptionService) { 

    this._accountsService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
      if(currentUser) {
        this.currentUserDisplay = currentUser;
      }
    });

    
  }

  ngOnInit() {
  }
  
  
}
