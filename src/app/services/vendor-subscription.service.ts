import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SubscriptionPlanTypes } from '../models/constants';
import { GooglePlacesEntityDisplay } from '../models/google-entity-display';
import { VendorPackagePricingComponent } from '../pages/vendor-connect/new-vendor-flow/vendor-package-pricing/vendor-package-pricing.component';
import { AccountsService } from './accounts.service';
// import { Storage } from '@ionic/storage-angular';
import { ChangeVendorSubscriptionRequest, CreatePromotionalDiscountRequest, GetVendorProfileByInfoRequest, GooglePlaceDetailsResponse, GooglePlaceRequest, GooglePlaceSearchResponse, GooglePlacesEntity, GooglePlacesSearchRequest, NeatBoutiqueApiService, PromoCodeReqeust, PromotionalDiscount, PromotionalDiscountResponse, Request, StripeCheckoutRequest, StripeCheckoutResponse, VendorProfile, VendorProfileResponse, VendorSubscriptionResponse } from './neat-boutique-api.service';
import { SubscriptionPackage } from '../models/vendor-subscription-package';
import { CurrentUserDisplay } from '../models/current-user-display';
import { VendorDisplay } from '../models/vendor-display';



@Injectable({
  providedIn: 'root',
})
export class VendorSubscriptionService {
  
  public vendorProfileSubject: BehaviorSubject<VendorProfile> = new BehaviorSubject<VendorProfile>(null);
  private _currentVendor: VendorProfile = null;
  private vendorForPricingPage: VendorProfile = null;
  private _googlePlace: GooglePlacesEntity = null;
  private _sessionToken: string = null;
  public vendorPackage: SubscriptionPackage;
  // numberOfBusinessesAlreadyConnected: number;
  numberOfBusinessesAlreadyConnectedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  hasPremiumAccountSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  // private _vendorSubscriptionId: string;

  constructor(private _neatBoutiqueApiService: NeatBoutiqueApiService, private _accountsService: AccountsService,
    private _router: Router) {
    this._currentVendor = new VendorProfile();
    this._accountsService.currentUserSubject.subscribe((userDisplay: CurrentUserDisplay) => {
      this.numberOfBusinessesAlreadyConnectedSubject.next(userDisplay?.vendors?.length);
      var hasPremiumAccount = userDisplay?.vendors?.some(x => x.vendorSubscriptionPlan === SubscriptionPlanTypes.VENDOR_PREMIUM);
      this.hasPremiumAccountSubject.next(hasPremiumAccount);
    });
  }

  setVendor(vendor: VendorProfile) {
    this._currentVendor = vendor;
    this.vendorProfileSubject.next(this._currentVendor);
  }

  setVendorForPricingPage(vendor: VendorProfile) {
    this.vendorForPricingPage = vendor;
  }
  clearVendorForPricingPage() {
    this.vendorForPricingPage = null;
  }
  getVendorForPricingPage() {
    
    return this.vendorForPricingPage ? new VendorDisplay(this.vendorForPricingPage) : null;
  }

  setGooglePlace(googlePlace: GooglePlacesEntity) {
    this._googlePlace = googlePlace;
  }

  getVendor() {
    return this._currentVendor;
  }

  getGooglePlace() {
    return this._googlePlace;
  }

  clearVendor() {
    this._currentVendor = null;
    this.vendorProfileSubject.next(this._currentVendor);
  }

  clearGooglePlace() {
    this._googlePlace = null;
  }

  clearSessionToken() {
    this._sessionToken = null;
  }

  clearServiceData() {
    this.clearVendor();
    this.clearGooglePlace();
    this.clearSessionToken();
  }

  autocompleteSearchForGooglePlace(searchRequest: string) {
    const request = new GooglePlacesSearchRequest();
    request.searchString = searchRequest;
    var promise = new Promise<GooglePlacesEntityDisplay[]>((resolve, reject) => {
      this._neatBoutiqueApiService
        .autocompleteSearchForGooglePlace(request)
        .subscribe((response: GooglePlaceSearchResponse) => {
          if (response.isSuccess) {
            this._sessionToken = response.googleSearchSessionToken;
            resolve(response.googlePlaces.map(x => new GooglePlacesEntityDisplay(x)));
          } else {
            //reject();
          }
      });
    }) 
    return promise;
  }

  async upgradeOnlyVendorSubscriptionToPremium (vendor: VendorProfile) {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_PREMIUM, environment.subscriptionPremiumStripePriceId);

    this.setVendor(vendor);
    this._router.navigateByUrl('/vendor-revise');
  };

  async downgradeOnlyVendorSubscriptionToStandard (vendor: VendorProfile) {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_STANDARD, environment.subscriptionStandardStripePriceId);
    this.setVendor(vendor);
    this._router.navigateByUrl('/vendor-revise');
  };

  async upgradeSelectedVendorSubscriptionToPremium (vendor: VendorProfile) {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_PREMIUM, environment.subscriptionPremiumAdditionalBusinessesStripePriceId);

    this.setVendor(vendor);
    this._router.navigateByUrl('/vendor-revise');
  };

  async downgradeSelectedVendorSubscriptionToStandard (vendor: VendorProfile) {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_STANDARD, environment.subscriptionStandardAdditionalBusinessesStripePriceId);
    this.setVendor(vendor);
    this._router.navigateByUrl('/vendor-revise');
  };

  createStripeCheckout(vendorPackage: SubscriptionPackage) {

    var request = new StripeCheckoutRequest();
    request.googlePlace = this._googlePlace;
    request.vendorProfile = this._currentVendor;
    request.planTier = vendorPackage.planTier;
    request.stripePriceId = vendorPackage.stripePriceId;
    request.promoCode = vendorPackage.promoCode;
    this._neatBoutiqueApiService.createStripeCheckout(request).subscribe((response: StripeCheckoutResponse) => {
      if(response.isSuccess) {
        if(response.isStripeBypassFreeForever) {
          this._router.navigateByUrl('/vendor-settings', { state: this._currentVendor });
        } else if(response.stripeSessionUrl) {
          window.open(response.stripeSessionUrl, "_self")
        }
        
      }
    });
  }

  completeAddAdditionalBusiness(vendorPackage: SubscriptionPackage) {

    var request = new StripeCheckoutRequest();
    request.googlePlace = this._googlePlace;
    request.vendorProfile = this._currentVendor;
    request.planTier = vendorPackage.planTier;
    request.stripePriceId = vendorPackage.stripePriceId;
    request.promoCode = vendorPackage.promoCode;
    this._neatBoutiqueApiService.addVendorSubscriptionToAccount(request).subscribe((response: VendorProfileResponse) => {
      if(response.isSuccess) {
        var vendors = this._accountsService.getCurrentUser().vendors;
        vendors = [ ...vendors, response.vendorProfile ];
        this._accountsService.setCurrentVendors(vendors);
        this._router.navigateByUrl('/vendor-businesses');
      }
    });
  }

  async startVendorSubscriptionCancelation(vendor: VendorProfile) {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.CONSUMER_BASIC, null);
    this.setVendor(vendor);
    this._router.navigateByUrl('/vendor-revise');
 }
  // getVendorSubscriptionId() {
  //   if(this._vendorSubscriptionId) {
  //     return this._vendorSubscriptionId;
  //   } else {
  //     return "";
  //   }
  // }


  // private _getVendorSubscriptionId() {
  //   var request = new Request();
  //   const promise = new Promise<string>((resolve, reject) => {
  //     this._neatBoutiqueApiService
  //         .getVendorSubscriptionId(request)
  //         .subscribe((response: VendorSubscriptionResponse) => {
  //           if (response.isSuccess) {
  //             resolve(response.vendorSubscriptionId);
  //           } else if (response.errors.find((x) => x.errorCode === "409")) {
  //             // failed search
  //             reject(null);
  //           }
  //         });
  //     });
  //     return promise;
  // }

  startFirstVendorSubscriptionWithPremium () {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_PREMIUM, environment.subscriptionPremiumStripePriceId);
    this._router.navigateByUrl('/vendor-connect');
  };

  startAdditionalVendorSubscriptionWithPremium () {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_PREMIUM, environment.subscriptionPremiumAdditionalBusinessesStripePriceId);
    this._router.navigateByUrl('/vendor-connect');
  };

  startFirstVendorSubscriptionWithStandard () {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_STANDARD, environment.subscriptionStandardStripePriceId);
    
    this._router.navigateByUrl('/vendor-connect');
  };

  startAdditionalVendorSubscriptionWithStandard () {
    this.vendorPackage = new SubscriptionPackage(SubscriptionPlanTypes.VENDOR_STANDARD, environment.subscriptionStandardAdditionalBusinessesStripePriceId);
    
    this._router.navigateByUrl('/vendor-connect');
  };

  getGooglePlacesDetails(googlePlace: GooglePlacesEntity) {
    const request = new GooglePlaceRequest();
    request.googleSearchSessionToken = this._sessionToken;
    this._googlePlace = googlePlace;
    request.googlePlace = googlePlace;

    const promise = new Promise<GooglePlaceDetailsResponse>((resolve, reject) => {
    this._neatBoutiqueApiService
        .getGooglePlaceDetails(request)
        .subscribe((response: GooglePlaceDetailsResponse) => {
          if (response.isSuccess) {
            resolve(response);
          } else if (response.errors.find((x) => x.errorCode === "409")) {
            // failed search
            reject(null);
          }
        });
    });
    return promise;
  }

  
  // completeVendorConnect(vendorPackage: SubscriptionPackage) {
  //   this._vendor.borderColor = '#013e43';
  //   return this._accountsService.connectVendor(this.paypalPackage.vendorSubscriptionId, vendorPackage.selectedPayPalPlan.id, this._googlePlace, this._vendor);
  // }

  completeVendorSubscriptionCancelation() {
    return this._accountsService.cancelVendorSubscription(this._currentVendor.id);
  }
  
  completeVendorRevise(vendorPackage: SubscriptionPackage) {
    if(vendorPackage.planTier === SubscriptionPlanTypes.VENDOR_PREMIUM) {
      return this._accountsService.changeVendorSubscriptionToPremium(this._currentVendor.id, vendorPackage);
    } else if (vendorPackage.planTier === SubscriptionPlanTypes.VENDOR_STANDARD) {
      return this._accountsService.changeVendorSubscriptionToStandard(this._currentVendor.id, vendorPackage);
    } else if (vendorPackage.planTier === SubscriptionPlanTypes.CONSUMER_BASIC) {
      return this._accountsService.cancelVendorSubscription(this._currentVendor.id);
    }
  }


  getVendorProfileHasSubscription() {
    const request = new GetVendorProfileByInfoRequest();
    request.googlePlace = this._googlePlace;
    request.vendorProfile = this._currentVendor;
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService
        .getVendorProfileByVendorInfo(request)
        .subscribe((response: VendorProfileResponse) => {
          if (response?.vendorProfile && response.vendorProfile.vendorSubscriptionPlan !== SubscriptionPlanTypes.VENDOR_NO_SUBSCRIPTION) {
            resolve(true)
          } else {
            resolve(false);
          }
        });
      });
      return promise;
  }

  applyPromoCode(promoCode: string) {
    const request = new PromoCodeReqeust();
    request.promoCode = promoCode;
    
    const promise = new Promise<PromotionalDiscountResponse>((resolve, reject) => {
      this._neatBoutiqueApiService.applyPromoCode(request).subscribe((response: PromotionalDiscountResponse) => {
          resolve(response)
        });
    });

    return promise;
  }

  create3MonthsFreePromotionalDiscount(message: string = null) {
    const request = new CreatePromotionalDiscountRequest();
    request.message = message;
    
    const promise = new Promise<PromotionalDiscount>((resolve, reject) => {
      this._neatBoutiqueApiService.create3MonthsFreePromotionalDiscount(request).subscribe((response: PromotionalDiscountResponse) => {
          if(response.isSuccess) {
            resolve(response.promotionalDiscount)
          }
          
        });
    });

    return promise;
  }

  create6MonthsFreePromotionalDiscount(message: string = null) {
    const request = new CreatePromotionalDiscountRequest();
    request.message = message;
    
    const promise = new Promise<PromotionalDiscount>((resolve, reject) => {
      this._neatBoutiqueApiService.create6MonthsFreePromotionalDiscount(request).subscribe((response: PromotionalDiscountResponse) => {
          if(response.isSuccess) {
            resolve(response.promotionalDiscount)
          }
          
        });
    });

    return promise;
  }

  createFreeForeverPromotionalDiscount(message: string = null) {
    const request = new CreatePromotionalDiscountRequest();
    request.message = message;
    
    const promise = new Promise<PromotionalDiscount>((resolve, reject) => {
      this._neatBoutiqueApiService.createFreeForeverPromotionalDiscount(request).subscribe((response: PromotionalDiscountResponse) => {
          if(response.isSuccess) {
            resolve(response.promotionalDiscount)
          }
          
        });
    });

    return promise;
  }

  getVendorPackage() {
   return this.vendorPackage;
  } 
  
}
