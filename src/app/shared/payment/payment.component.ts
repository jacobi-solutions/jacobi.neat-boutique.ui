import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { timeInterval } from 'rxjs/operators';
import { SubscriptionPlanTypes } from 'src/app/models/constants';
import { SubscriptionPackage } from 'src/app/models/vendor-subscription-package';
import { VendorPackagePricingComponent } from 'src/app/pages/vendor-connect/new-vendor-flow/vendor-package-pricing/vendor-package-pricing.component';
import { ChangeVendorSubscriptionRequest, NeatBoutiqueApiService } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';
import { environment } from 'src/environments/environment';





@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @Input() isRevise: boolean;
  @Output() OnCancel: EventEmitter<boolean> =  new EventEmitter<boolean>(null);
  @Output() OnSubscribe: EventEmitter<SubscriptionPackage> =  new EventEmitter<SubscriptionPackage>(null);
  @Output() OnCancelSubscription: EventEmitter<boolean> =  new EventEmitter<boolean>(null);
  vendorPackage: SubscriptionPackage;
  showPromoCodeForm: boolean;
  promoCodeMessage: string;
  isPromoCodeApplied: boolean;
  promoCodeWorked: boolean;
  showPayment: boolean;
  numberOfBusinessesConnected: number = 0;
  public subscriptionPlanTypes = SubscriptionPlanTypes;
  
  public promoCodeForm = new UntypedFormGroup({
    promoCode: new UntypedFormControl('', [  ])
  });
  constructor(private _vendorSubscriptionService: VendorSubscriptionService, private _neatBoutiqueApi: NeatBoutiqueApiService) { 
    this._vendorSubscriptionService.numberOfBusinessesAlreadyConnectedSubject.subscribe((numberOfBusinessesAlreadyConnected: number) => {
      if(numberOfBusinessesAlreadyConnected) {
        this.numberOfBusinessesConnected = numberOfBusinessesAlreadyConnected;
      }
    });
  }

  ngOnInit() {
    this.vendorPackage = this._vendorSubscriptionService.getVendorPackage();
    this.showPayment = true;
  }
  

  async enterPromoCode() {
    this.promoCodeWorked = false;
    var promoCode = this.promoCodeForm.value.promoCode;
    var promomotionalDiscountRepsponse = await this._vendorSubscriptionService.applyPromoCode(promoCode);
    if(promomotionalDiscountRepsponse.isSuccess) {
      this.vendorPackage.promoCode = promoCode;
      this.promoCodeMessage = promomotionalDiscountRepsponse.promotionalDiscount.message;
      this.promoCodeWorked = true;
    } else {
      this.promoCodeMessage = promomotionalDiscountRepsponse.errors[0]?.errorMessage;
    }

    this.isPromoCodeApplied = true;
    this.showPromoCodeForm = false;
    this.promoCodeForm.value.promoCode = "";
  }

  cancelVendorSubscription() {
    this.OnCancelSubscription.emit(true);
  }

  cancel() {
    this.OnCancel.emit(true);
  }


  checkOutWithStripe() {
    this.OnSubscribe.emit(this.vendorPackage);
  }
}
