import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrentUserDisplay } from './models/current-user-display';
import { VendorDisplay } from './models/vendor-display';
import { NeatBoutiqueApiService, VendorProfileRequest, Request, VendorProfilesRequest, VendorProfilesResponse, VendorProfileWithReviewsResponse } from './services/neat-boutique-api.service';

@Injectable({
  providedIn: 'root',
})
export class VendorService {

  public vendorsByCommunityNameSubject: BehaviorSubject<VendorDisplay[]> = new BehaviorSubject<VendorDisplay[]>(null);
  private _currentCommunity: string;
  private _vendorListPage: number = 0;
  private _vendorsInList: VendorDisplay[] = [];
  constructor(private _neatBoutiqueApiService: NeatBoutiqueApiService) {}

  getVendorProfileWithReviewsByPath(profilePath: string) {
    const request = new VendorProfileRequest();
    request.profilePath = profilePath;
    const promise = new Promise<VendorDisplay>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getVendorProfileWithReviewsByPath(request)
      .subscribe((response: VendorProfileWithReviewsResponse) => {
        if(response.isSuccess) {
          resolve(new VendorDisplay(response.vendorProfile, response.reviews));
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          reject(false);
        }
      });
    });
    return promise;
  }

  getVendorProfileWithReviewsById(vendorId: string) {
    const request = new VendorProfileRequest();
    request.vendorId = vendorId;
    const promise = new Promise<VendorDisplay>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getVendorProfileWithReviewsById(request)
      .subscribe((response: VendorProfileWithReviewsResponse) => {
        if(response.isSuccess) {
          resolve(new VendorDisplay(response.vendorProfile, response.reviews));
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          reject(false);
        }
      });
    });
    return promise;
  }

  getVendorsByCommunityName(communityName: string, pageNumber: number = 0, pageSize: number = 10) {    
    const request = new VendorProfilesRequest();
    request.communityName = communityName;
    request.pageNumber = pageNumber;
    request.pageSize = pageSize;
    const promise = new Promise<VendorDisplay[]>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getVendorsByCommunityName(request)
      .subscribe((response: VendorProfilesResponse) => {
        if(response.isSuccess) {
          this.vendorsByCommunityNameSubject.next(response.vendorProfiles.map(vendor => new VendorDisplay(vendor)));
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          // this.authService.revokeToken();
          reject(false);
        }
      });
    });
    return promise;
  }

  getVendorsForVendorPrompt() {    
    const request = new Request();
    const promise = new Promise<VendorDisplay[]>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getSampleOfVendors(request)
      .subscribe((response: VendorProfilesResponse) => {
        if(response.isSuccess) {
          resolve(response.vendorProfiles.map(vendor => new VendorDisplay(vendor)));
        } else {
          // this.authService.revokeToken();
          reject(false);
        }
      });
    });
    return promise;
  }


  loadMoreVendorsByCommunityName(communityName: string, pageNumber: number = 0, pageSize: number = 10) {  
    const isNewCommunity = this._currentCommunity !== communityName; 
    if(isNewCommunity) {
      this._vendorListPage = 0;
      this._vendorsInList = [];
    } else {
      this._vendorListPage += 1;
    }

    this._currentCommunity = communityName;

    const request = new VendorProfilesRequest();
    request.communityName = communityName;
    request.pageNumber = this._vendorListPage;
    request.pageSize = pageSize;
    const promise = new Promise<VendorDisplay[]>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getVendorsByCommunityName(request)
      .subscribe((response: VendorProfilesResponse) => {
        if(response.isSuccess) {
          this._vendorsInList = [...this._vendorsInList, ...response.vendorProfiles.map(x => new VendorDisplay(x))];
          this.vendorsByCommunityNameSubject.next(this._vendorsInList)
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          // this.authService.revokeToken();
          reject(false);
        }
      });
    });
    return promise;
  }

}
