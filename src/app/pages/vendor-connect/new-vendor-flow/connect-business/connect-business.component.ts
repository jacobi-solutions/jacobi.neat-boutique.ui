import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { SubscriptionPlanTypes } from 'src/app/models/constants';
import { GooglePlacesEntityDisplay } from 'src/app/models/google-entity-display';
import { SubscriptionPackage } from 'src/app/models/vendor-subscription-package';
import { GooglePlaceDetailsResponse, GooglePlacesEntity, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-connect-business',
  templateUrl: './connect-business.component.html',
  styleUrls: ['../../vendor-connect.page.scss', './connect-business.component.scss'],
})
export class ConnectBusinessComponent implements OnInit {
  public googlePlacesResults: GooglePlacesEntityDisplay[] = null;
  public vendorPackage: SubscriptionPackage;
  public selectedGooglePlace: GooglePlaceDetailsResponse;
  public webHeaderHeight: number;
  public subscriptionPlanTypes = SubscriptionPlanTypes;

  private _searchVendor: { minChars: number, lastSearchText: string, results: GooglePlacesEntityDisplay[] };
  public connectBusiness = new UntypedFormGroup({
    businessName: new UntypedFormControl('', [ Validators.required ]),
    businessEntity: new UntypedFormControl('', [ Validators.required ]),
  });

  public showVendorAlreadyAccociatedError: boolean;
  private _googlePlaceToSave: GooglePlacesEntity = null;
  numberOfBusinessesConnected: number = 0;

  constructor(private _navCtrl: NavController, private _vendorSubscriptionService: VendorSubscriptionService) {
    this.vendorPackage = _vendorSubscriptionService.getVendorPackage();
    this._searchVendor = { minChars: 3, lastSearchText: '', results: [] };  

    this._vendorSubscriptionService.numberOfBusinessesAlreadyConnectedSubject.subscribe((numberOfBusinessesAlreadyConnected: number) => {
      if(numberOfBusinessesAlreadyConnected) {
        this.numberOfBusinessesConnected = numberOfBusinessesAlreadyConnected;
      }
    });
  }

  ngOnInit() {
    this.connectBusiness.controls.businessName.valueChanges
      .pipe(debounceTime(500))
      .subscribe((searchText) => {
        this.searchBusinesses(searchText);
      });
    
      this._vendorSubscriptionService.clearVendor();
      this._vendorSubscriptionService.clearGooglePlace();
  }

  async searchBusinesses(rawSearchText: string) {
    const searchText = rawSearchText?.trim();
    if(searchText !== this.selectedGooglePlace?.name) {
      this.selectedGooglePlace = null;
    }

    if(searchText && (searchText?.length >= this._searchVendor.minChars) && (searchText !== this._searchVendor?.lastSearchText)) {
      this._searchVendor.lastSearchText = searchText;
      this._searchVendor.results = await this._vendorSubscriptionService.autocompleteSearchForGooglePlace(searchText);
      this.googlePlacesResults = this._searchVendor.results;      
    } else {
      this.googlePlacesResults = [];
      this._searchVendor.lastSearchText = '';
    }   
  }

  async selectBusiness(business: GooglePlacesEntityDisplay) {    
    this._googlePlaceToSave = business;
    const googlePlaceDetails = await this._vendorSubscriptionService.getGooglePlacesDetails(business);
    this.selectedGooglePlace = googlePlaceDetails;    
    this.googlePlacesResults = null;  
  }

  setContentHeight(headerHeight) {
    const contentWrapper = document.querySelector('.vendor-connect > ion-grid');
    contentWrapper.setAttribute('style', `height: calc(100% - ${headerHeight}px)`)
  }

  saveAndContinue() {
    if(this.connectBusiness.invalid) {
      return null;
    }

    const vendor = new VendorProfile();
    vendor.googlePlaceId = this._googlePlaceToSave.placeId;

    this._vendorSubscriptionService.setVendor(vendor);
    this._vendorSubscriptionService.setGooglePlace(this._googlePlaceToSave);

    this._vendorSubscriptionService.getVendorProfileHasSubscription().then((hasVendorSubscription) => {
      if(hasVendorSubscription) {
        this.showVendorAlreadyAccociatedError = true;
      } else {
        this.connectBusiness.reset();
        this._navCtrl.navigateForward('vendor-connect/business-community');
      }
    });
  }

  cancel() {
    this._vendorSubscriptionService.clearServiceData();
    this._navCtrl.back();
  }
}
