import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-business-category',
  templateUrl: './business-category.component.html',
  styleUrls: ['../../vendor-connect.page.scss', './business-category.component.scss'],
})
export class BusinessCategoryComponent implements OnInit {
  public categoryDropDown: { label: string, value: string }[];
  public businessCategory = new UntypedFormGroup({
    email: new UntypedFormControl('', [ Validators.required ]),
    categoryCategory: new UntypedFormControl('', [ Validators.required ]),
    facebookLink: new UntypedFormControl('', []),
    instagramLink: new UntypedFormControl('', []),
    twitterLink: new UntypedFormControl('', []),
  });
  private _vendor: VendorProfile;
  numberOfBusinessesConnected: number = 0;

  constructor(private _navCtrl: NavController, private _vendorSubscriptionService: VendorSubscriptionService, 
      private _categoryService: CategoryService) { 
        this._vendorSubscriptionService.numberOfBusinessesAlreadyConnectedSubject.subscribe((numberOfBusinessesAlreadyConnected: number) => {
          if(numberOfBusinessesAlreadyConnected) {
            this.numberOfBusinessesConnected = numberOfBusinessesAlreadyConnected;
          }
        });
      }

  ngOnInit() {
    this.categoryDropDown = this._categoryService.categories.map(category => ({ label: category.name, value: category.name }));
    this._vendor = this._vendorSubscriptionService.getVendor();
    this.businessCategory.value.email = this._vendor?.businessEmail || null;
    this.businessCategory.value.categoryCategory = this._vendor?.categories || [];
    this.businessCategory.value.facebookLink = this._vendor?.facebookURL || null;
    this.businessCategory.value.instagramLink = this._vendor?.instagramURL || null;
    this.businessCategory.value.twitterLink = this._vendor?.twitterURL || null;
  }

  setContentHeight(headerHeight) {
    const contentWrapper = document.querySelector('.vendor-connect > ion-grid');
    contentWrapper.setAttribute('style', `height: calc(100% - ${headerHeight}px)`)
  }

  saveAndContinue() {
    if(this.businessCategory.invalid) {
      return null;
    }        

    this._vendor.businessEmail = this.businessCategory.value.email;
    this._vendor.categories = this.businessCategory.value.categoryCategory;
    this._vendor.facebookURL = this.businessCategory.value.facebookLink;
    this._vendor.instagramURL = this.businessCategory.value.instagramLink;
    this._vendor.twitterURL = this.businessCategory.value.twitterLink;
    
    this._vendorSubscriptionService.setVendor(this._vendor);
    this.businessCategory.reset();
    this._navCtrl.navigateForward('vendor-connect/vendor-package-pricing');
  }

  cancel() {
    this._navCtrl.back();
  }
}
