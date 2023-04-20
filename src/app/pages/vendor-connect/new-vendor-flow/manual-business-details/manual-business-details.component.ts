import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-manual-business-details',
  templateUrl: './manual-business-details.component.html',
  styleUrls: ['../../vendor-connect.page.scss', './manual-business-details.component.scss'],
})
export class ManualBusinessDetailsComponent implements OnInit {
  public businessDetails = new UntypedFormGroup({
    name: new UntypedFormControl('', [ Validators.required ]),
    // address: new FormControl('', [ Validators.required ]),
    streetAddress: new UntypedFormControl('', [ Validators.required ]),
    city:  new UntypedFormControl('', [ Validators.required ]),
    state:  new UntypedFormControl('', [ Validators.required ]),
    country:  new UntypedFormControl('', [ Validators.required ]),
    zip:  new UntypedFormControl('', [ Validators.required, Validators.minLength(5) ]),
    website: new UntypedFormControl('', []),
    phone: new UntypedFormControl('', []),
  });
  public showVendorAlreadyAccociatedError: boolean;
  private _vendor: VendorProfile;
  
  // public previousPage: any
  constructor(private _navCtrl: NavController, private _vendorSubscriptionService: VendorSubscriptionService) { }

  ngOnInit() {
    this._vendor = new VendorProfile();
    this.businessDetails.value.name = this._vendor?.name || null;
    this.businessDetails.value.streetAddress = this._vendor?.address || null;
    this.businessDetails.value.city = this._vendor?.city || null;
    this.businessDetails.value.state = this._vendor?.state || null;
    this.businessDetails.value.country = this._vendor?.country || null;
    this.businessDetails.value.zip = this._vendor?.zip || null;
    this.businessDetails.value.website = this._vendor?.websiteURL || null;
    this.businessDetails.value.phone = this._vendor?.phoneNumber || null;
  }


  setContentHeight(headerHeight) {
    const contentWrapper = document.querySelector('.vendor-connect > ion-grid');
    contentWrapper.setAttribute('style', `height: calc(100% - ${headerHeight}px)`)
  }
  
  saveAndContinue() {
    if(this.businessDetails.invalid || !this._vendor) {
      return null;
    }    

    this._vendor.name = this.businessDetails.value.name;
    this._vendor.address = this.businessDetails.value.streetAddress;
    this._vendor.city = this.businessDetails.value.city;
    this._vendor.state = this.businessDetails.value.state;
    this._vendor.country = this.businessDetails.value.country;
    this._vendor.zip = this.businessDetails.value.zip;
    this._vendor.phoneNumber = this.businessDetails.value.phone;
    this._vendor.websiteURL = this.businessDetails.value.website;
    
    this._vendorSubscriptionService.setVendor(this._vendor);
    this._vendorSubscriptionService.getVendorProfileHasSubscription().then((hasVendorSubscription) => {
      if(hasVendorSubscription) {
        this.showVendorAlreadyAccociatedError = true;
      } else {
        this.businessDetails.reset();
        this._navCtrl.navigateForward('vendor-connect/business-community');
      }
    });
  }

  cancel() {
    this._vendorSubscriptionService.clearServiceData();
    this._navCtrl.back();
  }
}
