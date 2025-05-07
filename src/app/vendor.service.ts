import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CurrentUserDisplay } from './models/current-user-display';
import { VendorDisplay } from './models/vendor-display';
import { NeatBoutiqueApiService, VendorProfileRequest, Request, VendorProfilesRequest, VendorProfilesResponse, VendorProfileWithReviewsResponse, CategoryType } from './services/neat-boutique-api.service';

@Injectable({
  providedIn: 'root',
})
export class VendorService {

  public vendorsByCategoryNameSubject: BehaviorSubject<VendorDisplay[]> = new BehaviorSubject<VendorDisplay[]>(null);
  private _currentCategory: string;
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

  // Helper method to map a string category to the CategoryType enum
  private mapStringToCategoryType(categoryName: string): CategoryType {
    // Find the enum key that matches the category name value
    const enumKey = Object.keys(CategoryType).find(key => CategoryType[key] === categoryName);
    if (!enumKey) {
      throw new Error(`Invalid category name: ${categoryName}`);
    }
    return CategoryType[enumKey as keyof typeof CategoryType];
  }

  getVendorsByCategoryName(categoryName: string, pageNumber: number = 0, pageSize: number = 10) {    
    const request = new VendorProfilesRequest();
    request.category = this.mapStringToCategoryType(categoryName);
    request.pageNumber = pageNumber;
    request.pageSize = pageSize;
    const promise = new Promise<VendorDisplay[]>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getVendorsByCategoryName(request)
      .subscribe((response: VendorProfilesResponse) => {
        if(response.isSuccess) {
          this.vendorsByCategoryNameSubject.next(response.vendorProfiles.map(vendor => new VendorDisplay(vendor)));
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


  loadMoreVendorsByCategoryName(categoryName: string, pageNumber: number = 0, pageSize: number = 10) {  
    const isNewCategory = this._currentCategory !== categoryName; 
    if(isNewCategory) {
      this._vendorListPage = 0;
      this._vendorsInList = [];
    } else {
      this._vendorListPage += 1;
    }

    this._currentCategory = categoryName;

    const request = new VendorProfilesRequest();
    request.category = this.mapStringToCategoryType(categoryName);
    request.pageNumber = this._vendorListPage;
    request.pageSize = pageSize;
    const promise = new Promise<VendorDisplay[]>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getVendorsByCategoryName(request)
      .subscribe((response: VendorProfilesResponse) => {
        if(response.isSuccess) {
          this._vendorsInList = [...this._vendorsInList, ...response.vendorProfiles.map(x => new VendorDisplay(x))];
          this.vendorsByCategoryNameSubject.next(this._vendorsInList)
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          // this.authService.revokeToken();
          reject(false);
        }
      });
    });
    return promise;
  }

}
