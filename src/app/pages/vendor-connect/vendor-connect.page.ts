import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-vendor-connect',
  templateUrl: './vendor-connect.page.html',
  styleUrls: ['./vendor-connect.page.scss'],
})
export class VendorConnectPage implements OnInit {

  constructor() { 
    
  }

  ngOnInit() {}
}
