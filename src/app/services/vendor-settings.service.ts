import { Injectable } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { CurrentUserDisplay } from "../models/current-user-display";
import { AccountsService } from "./accounts.service";
import { promise } from 'protractor';
import { Request, Response, NeatBoutiqueApiService, VendorImageRequest, Post, VendorPostRequest, PostResponse, VendorProfileResponse, HeroAdTemplatesResponse, HeroAdTemplate, CreateHeroAdRequest, VendorDescriptionRequest, VendorSocialLinksRequest, VendorCategoriesRequest, AdTagline, VendorBorderColorRequest, VendorProfile, CustomerDiscount, VendorGeneralDiscountsRequest, CategoryType } from './neat-boutique-api.service';
import { VendorProfileOrNull } from 'typings/custom-types';
import { UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { VendorDisplay } from '../models/vendor-display';

// edit enum
export enum EditVendorExitCodes {
  SUCCESS,
  ERR_NO_COMMUNITY_SELECTED,
  ERR_SOCIAL_MEDIA_FAILED_UPDATE,
};

export type VendorEdits = {
  logo: any
};




@Injectable({
  providedIn: 'root'
})
export class VendorSettingsService {

  public vendorEditsSubject: BehaviorSubject<VendorEdits> = new BehaviorSubject<VendorEdits>(null);

  private _currentUser: CurrentUserDisplay;
  newPollAdSubject: BehaviorSubject<UntypedFormGroup> = new BehaviorSubject<UntypedFormGroup>(null);
  
  // public trackAnswerVotesSubject: BehaviorSubject<AnswerToPollAssociation[]> = new BehaviorSubject<AnswerToPollAssociation[]>(null);
  // private _trackAnswerVotesList: AnswerToPollAssociation[] = []

  constructor(private _accountsService: AccountsService, private _neatBoutiqueApi: NeatBoutiqueApiService) {
    this._accountsService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this._currentUser = user;
    });
  }

  public updateVendorDescription(vendorId: string, description: string) {
    var request = new VendorDescriptionRequest();
    request.vendorId = vendorId;
    request.description = description;

    const promise = new Promise<VendorDisplay>((resolve, reject) => {
      this._neatBoutiqueApi.updateVendorDescription(request).subscribe((response: VendorProfileResponse) => {
        if (response.isSuccess) {
          resolve(new VendorDisplay(response.vendorProfile));
        }
      });
    });

    return promise;
  }

  public updateVendorCustomerDiscounts(vendorId: string, discounts: CustomerDiscount[]) {
    var request = new VendorGeneralDiscountsRequest();
    
    request.generalDiscounts = discounts;

    const promise = new Promise<VendorDisplay>((resolve, reject) => {
      this._neatBoutiqueApi.updateVendorGeneralDiscounts(request).subscribe((response: VendorProfileResponse) => {
        if (response.isSuccess) {
          resolve(new VendorDisplay(response.vendorProfile));
        }
      });
    });

    return promise;
  }

  public updateVendorSocialLinks(vendorId: string, facebookURL: string, instagramURL: string, twitterURL: string) {
    // it's ok if one or more of the url's are empty. the backend will only update non-empty fields
    var request = new VendorSocialLinksRequest();
    request.vendorId = vendorId;
    request.facebookURL = facebookURL;
    request.instagramURL = instagramURL;
    request.twitterURL = twitterURL;

    const promise = new Promise<VendorDisplay>((resolve, reject) => {
      this._neatBoutiqueApi.updateSocialLinks(request).subscribe((response: VendorProfileResponse) => {
        if (response.isSuccess) {
          resolve(new VendorDisplay(response.vendorProfile));
        }
      });
    });

    return promise;
  }

  public updateVendorCategories(vendorId: string, categories: string[]) {
    var request = new VendorCategoriesRequest();
    request.vendorId = vendorId;
    request.categories = categories.map(x => x as unknown as CategoryType);

    const promise = new Promise<VendorDisplay>((resolve, reject) => {
      this._neatBoutiqueApi.updateCategories(request).subscribe((response: VendorProfileResponse) => {
        if (response.isSuccess) {
          resolve(new VendorDisplay(response.vendorProfile));
        }
      });
    });

    return promise;
  }


  public uploadVendorLogo(vendorId: string, logoBase64Path: string) {    
    var request = new VendorImageRequest();
    request.vendorId = vendorId;
    request.base64Image = logoBase64Path;

    const promise = new Promise<VendorDisplay>((resolve, reject) => {
      this._neatBoutiqueApi.uploadVendorLogo(request).subscribe((response: VendorProfileResponse) => {
        if(response.isSuccess) {
          // this.vendorEdits.next({
          //   logo: response.vendorProfile.avatar
          // });
          resolve(new VendorDisplay(response.vendorProfile));
        }
      });
    });

    return promise;
  }

  public uploadPhoto(vendorId: string, imgBase64Path: string, position: number) {
    var request = new VendorImageRequest();
    request.photoPosition = position;
    request.vendorId = vendorId;
    request.base64Image = imgBase64Path;

    const promise = new Promise<VendorDisplay>((resolve, reject) => {
      this._neatBoutiqueApi.uploadVendorPhoto(request).subscribe((response: VendorProfileResponse) => {
        if(response.isSuccess) {
          resolve(new VendorDisplay(response.vendorProfile));
        }
      });
    });

    return promise;
  }

  public updateBorderColor(vendorId: string, color: string) {
    var request = new VendorBorderColorRequest();
    request.vendorId = vendorId;
    request.borderColor = color;

    const promise = new Promise<VendorProfile>((resolve, reject) => {
      this._neatBoutiqueApi.updateVendorBorderColor(request).subscribe((response: VendorProfileResponse) => {
        if (response.isSuccess) {
          this._accountsService.setCurrentVendor(response.vendorProfile);
          resolve(response.vendorProfile);
        }
      });
    });
    return promise;

  }

    

  


  // ================================ DUMMY DATA - TODO: Replace method return with backend call result when able ==================================================

  public getCategoryImages() {
    return [
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/amirali-mirhashemian-jh5XyK4Rr3Y-unsplash.jpg',
        label: 'Category 1',
      },
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/amirali-mirhashemian-sc5sTPMrVfk-unsplash.jpg',
        label: 'Category 2',
      },
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/sk-CK6tjAIMJWM-unsplash.jpg',
        label: 'Category 3',
      },
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/amirali-mirhashemian-d-yAWqj-DRg-unsplash.jpg',
        label: 'Category 4',
      }
    ];
  }

  public getCategoryTaglines() {
    const categoryTaglines = [];
    for (let category in CategoryType) {
      categoryTaglines.push({
        tagline: `${CategoryType[category]} tagline`,
        label: `${CategoryType[category]} tagline`
      })
    }
    return categoryTaglines;
  }

  // hero ads ======================
  public getHeroAdTemplatesForVendor() {
    return new Promise<HeroAdTemplate[]>((resolve, reject) => {
      this._neatBoutiqueApi.getHeroAdTemplatesForVendor(new Request()).subscribe((response: HeroAdTemplatesResponse) => {
        if(response.isSuccess) {
          resolve(response.templates);
        } else {
          reject();
        }
      });
    });
  }


  public createHeroAdForVendor(vendorId: string, categoryName: CategoryType, adTagline: AdTagline, callToAction: string, imageUrl: string) {
    const request = new CreateHeroAdRequest();
    request.category = categoryName;
    request.adTagline = adTagline;
    request.callToAction = callToAction;
    request.imageUrl = imageUrl;
    request.vendorProfileId = vendorId;
    return new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApi.createHeroAdForVendor(request).subscribe((response: Response) => {
        if(response.isSuccess) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  // polls ads ======================
  
  public updateCurrentPollAd(pollForm: UntypedFormGroup) {
    this.newPollAdSubject.next(pollForm);
  }

  

  public createVendorPost(pollPost: Post) {
    const request = new VendorPostRequest();
    request.post = pollPost;

    const promise = new Promise<Post>((resolve, reject) => {
      this._neatBoutiqueApi.createVendorPost(request).subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          resolve(response.post);
        }
      });
    });

    return promise;
  }

}

