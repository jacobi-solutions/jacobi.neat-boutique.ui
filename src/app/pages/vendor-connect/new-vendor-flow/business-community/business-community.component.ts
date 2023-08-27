import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CommunityService } from 'src/app/services/community.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-business-community',
  templateUrl: './business-community.component.html',
  styleUrls: ['../../vendor-connect.page.scss', './business-community.component.scss'],
})
export class BusinessCommunityComponent implements OnInit {
  public communityDropDown: { label: string, value: string }[];
  public businessCommunity = new UntypedFormGroup({
    email: new UntypedFormControl('', [ Validators.required ]),
    communityCategory: new UntypedFormControl('', [ Validators.required ]),
    facebookLink: new UntypedFormControl('', []),
    instagramLink: new UntypedFormControl('', []),
    twitterLink: new UntypedFormControl('', []),
  });
  private _vendor: VendorProfile;
  numberOfBusinessesConnected: number = 0;

  constructor(private _navCtrl: NavController, private _vendorSubscriptionService: VendorSubscriptionService, 
      private _communityService: CommunityService) { 
        this._vendorSubscriptionService.numberOfBusinessesAlreadyConnectedSubject.subscribe((numberOfBusinessesAlreadyConnected: number) => {
          if(numberOfBusinessesAlreadyConnected) {
            this.numberOfBusinessesConnected = numberOfBusinessesAlreadyConnected;
          }
        });
      }

  ngOnInit() {
    this.communityDropDown = this._communityService.communities.map(community => ({ label: community.name, value: community.name }));
    this._vendor = this._vendorSubscriptionService.getVendor();
    this.businessCommunity.value.email = this._vendor?.businessEmail || null;
    this.businessCommunity.value.communityCategory = this._vendor?.communities || [];
    this.businessCommunity.value.facebookLink = this._vendor?.facebookURL || null;
    this.businessCommunity.value.instagramLink = this._vendor?.instagramURL || null;
    this.businessCommunity.value.twitterLink = this._vendor?.twitterURL || null;
  }

  setContentHeight(headerHeight) {
    const contentWrapper = document.querySelector('.vendor-connect > ion-grid');
    contentWrapper.setAttribute('style', `height: calc(100% - ${headerHeight}px)`)
  }

  saveAndContinue() {
    if(this.businessCommunity.invalid) {
      return null;
    }        

    this._vendor.businessEmail = this.businessCommunity.value.email;
    this._vendor.communities = this.businessCommunity.value.communityCategory;
    this._vendor.facebookURL = this.businessCommunity.value.facebookLink;
    this._vendor.instagramURL = this.businessCommunity.value.instagramLink;
    this._vendor.twitterURL = this.businessCommunity.value.twitterLink;
    
    this._vendorSubscriptionService.setVendor(this._vendor);
    this.businessCommunity.reset();
    this._navCtrl.navigateForward('vendor-connect/vendor-package-pricing');
  }

  cancel() {
    this._navCtrl.back();
  }
}
