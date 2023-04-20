import { Component, OnInit } from '@angular/core';
import { PromotionalDiscount } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

export const DiscountTypes = {
  FREE_3_MONTHS: "free3months",
  FREE_6_MONTHS: "free6months",
  FREE_FOREVER: "freeforever"
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  discountTypes = DiscountTypes;
  discountType: string;
  message: string;
  promoCode: string;
  constructor(private _subscriptionService: VendorSubscriptionService) { }

  ngOnInit() {

  }

  async createPromotionalDiscount() {
    var promotionalDiscount: PromotionalDiscount;
    if(this.discountType === DiscountTypes.FREE_3_MONTHS) {
      promotionalDiscount = await this._subscriptionService.create3MonthsFreePromotionalDiscount(this.message);
    } else if(this.discountType === DiscountTypes.FREE_6_MONTHS) {
      promotionalDiscount = await this._subscriptionService.create6MonthsFreePromotionalDiscount(this.message);
    } else if(this.discountType === DiscountTypes.FREE_FOREVER) {
      promotionalDiscount = await this._subscriptionService.createFreeForeverPromotionalDiscount(this.message);
    }
    
    this.promoCode = promotionalDiscount.promoCode;
  }

}
