import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
import { SubscriptionPlanTypes } from "src/app/constants/subscription-plan-types";
import { SubscriptionPackage } from 'src/app/models/vendor-subscription-package';

@Component({
  selector: 'app-vendor-revise',
  templateUrl: './vendor-revise.page.html',
  styleUrls: ['./vendor-revise.page.scss'],
})
export class VendorRevisePage implements OnInit {
  constructor(private _vendorSubscriptionService: VendorSubscriptionService, private _navCtrl: NavController, private _router: Router) { }

  async ngOnInit() {
  }

  cancel() {
    this._navCtrl.back();
  }


  async changeVendorSubscription(vendorPackage: SubscriptionPackage) {
    await this._vendorSubscriptionService.completeVendorRevise(vendorPackage);
    this._router.navigateByUrl('/vendor-settings', { state: this._vendorSubscriptionService.getVendor() });
  }

  async cancelVendorSubscription(shouldCancelSubscription: boolean) {
    if(shouldCancelSubscription){
      await this._vendorSubscriptionService.completeVendorSubscriptionCancelation();
      this._router.navigateByUrl('/feed');
    }
  }
}
