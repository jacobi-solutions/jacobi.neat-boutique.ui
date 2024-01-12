import { Injectable } from '@angular/core';
import { CommunityTypes } from '../models/constants';

import { ModalController } from "@ionic/angular";
import { CurrentUserDisplay } from "../models/current-user-display";
import { AccountsService } from "./accounts.service";
import { promise } from 'protractor';
import { Request, Response, NeatBoutiqueApiService, VendorImageRequest, Post, VendorPostRequest, PostResponse, VendorProfileResponse, HeroAdTemplatesResponse, HeroAdTemplate, CreateHeroAdRequest, VendorDescriptionRequest, VendorSocialLinksRequest, VendorCommunitiesRequest, AdTagline, VendorBorderColorRequest, VendorProfile } from './neat-boutique-api.service';
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

  public updateVendorCommunities(vendorId: string, communities: string[]) {
    var request = new VendorCommunitiesRequest();
    request.vendorId = vendorId;
    request.communities = communities;

    const promise = new Promise<VendorDisplay>((resolve, reject) => {
      this._neatBoutiqueApi.updateCommunities(request).subscribe((response: VendorProfileResponse) => {
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
          var currentVendors = this._currentUser.vendors.filter(x => x.id !== vendorId)
          currentVendors = [ response.vendorProfile, ...currentVendors]
          this._accountsService.setCurrentVendors(currentVendors);
          resolve(response.vendorProfile);
        }
      });
    });
    return promise;

  }

    

  


  // ================================ DUMMY DATA - TODO: Replace method return with backend call result when able ==================================================

  public getCommunityImages() {
    return [
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/amirali-mirhashemian-jh5XyK4Rr3Y-unsplash.jpg',
        label: 'Community 1',
      },
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/amirali-mirhashemian-sc5sTPMrVfk-unsplash.jpg',
        label: 'Community 2',
      },
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/sk-CK6tjAIMJWM-unsplash.jpg',
        label: 'Community 3',
      },
      {
        imageUrl: 'https://storage.googleapis.com/neatboutique.com/images/amirali-mirhashemian-d-yAWqj-DRg-unsplash.jpg',
        label: 'Community 4',
      }
    ];
  }

  public getCommunityTaglines() {

    const communityTaglines = [];
    for (let community in CommunityTypes) {
      communityTaglines.push({
        tagline: `${CommunityTypes[community]} tagline`,
        label: `${CommunityTypes[community]} tagline`
      })
    }
    return communityTaglines;
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


  public createHeroAdForVendor(vendorId: string, communityName: string, adTagline: AdTagline, callToAction: string, imageUrl: string) {
    const request = new CreateHeroAdRequest();
    request.communityName = communityName;
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

