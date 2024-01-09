import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnswerDisplay } from '../models/answer-display';
import { ConsumerPostDisplay } from '../models/consumer-post-display';
import { ConsumerProfileActivityDisplay } from '../models/consumer-profile-activity-display';
import { CurrentUserDisplay } from '../models/current-user-display';
import { ReviewDisplay } from '../models/review-display';
import { VendorDisplay } from '../models/vendor-display';
import { AccountsService } from './accounts.service';
import { MyPlacesRequest, NeatBoutiqueApiService, VendorProfile, Response, Request, VendorProfileResponse, ReviewRequest, Review, ReviewResponse, ReviewRemoveRequest, VendorProfilesResponse, ReviewUpdateRequest, VendorProfileWithReviewsResponse, ReviewsResponse, ConsumerProfileRequest, ConsumerProfile, ConsumerProfileResponse, ConsumerProfileActivityRequest, ConsumerProfileActivityResponse, ConsumerImageRequest, ConsumerDescriptionRequest, ConsumerBorderColorRequest, ConsumerNotificationSettingsRequest, ConsumerFeedSettingsRequest } from './neat-boutique-api.service';

@Injectable({
  providedIn: 'root',
})
export class ConsumerService {

  public vendorsInMyListSubject: BehaviorSubject<VendorDisplay[]> = new BehaviorSubject<VendorDisplay[]>(null);
  private _myList: VendorDisplay[] = [];
  private _currentUser: CurrentUserDisplay;
  

  constructor(
    private _neatBoutiqueApiService: NeatBoutiqueApiService,
    private _accountService: AccountsService) {
    this._accountService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
      this._currentUser = currentUser;
    });
  }

  getVendorProfilesForMyPlaces() {
    const request = new Request({ data: 'get some data' });
    return new Promise<VendorDisplay[]>((resolve, reject) => {
      
      this._neatBoutiqueApiService.getVendorProfilesForMyPlaces(request).subscribe((response: VendorProfilesResponse) => {        
        if (response.isSuccess) {
          this._myList = response.vendorProfiles.map(vendor => new VendorDisplay(vendor));
          this.vendorsInMyListSubject.next(this._myList);
          // resolve(response.vendorProfiles.map(vendor => new VendorDisplay(vendor)));
        } else {
          reject(response.errors);
        }
      });
    });
  }

  getRecentActivitesByConsumerId(consumerId: string, pageNumber: number, pageSize: number) {
    const request = new ConsumerProfileActivityRequest({
      consumerId: consumerId,
      pageNumber: pageNumber,
      pageSize: pageSize
    });
    
    return new Promise<ConsumerProfileActivityDisplay>((resolve, reject) => {
      
      this._neatBoutiqueApiService.getRecentActivityByConsumerId(request).subscribe((response: ConsumerProfileActivityResponse) => {        
        if (response.isSuccess) {
          var activityDisplay = new ConsumerProfileActivityDisplay();
          activityDisplay.questionsAskedCount = response.questionsAskedCount;
          activityDisplay.questionsAnsweredCount = response.questionsAnsweredCount;
          activityDisplay.reviewsCount = response.reviewsCount;
          activityDisplay.recentQuestions = response.recentQuestions.map(x => new ConsumerPostDisplay(x));
          activityDisplay.recentAnswers = response.recentAnswers.map(x => new ConsumerPostDisplay(x));
          activityDisplay.recentReviews = response.recentReviews.map(x => new ReviewDisplay(x));
          resolve(activityDisplay);
        } else {
          reject(response.errors);
        }
      });
    });
  }

  getConsumerProfileByPath(profilePath: string) {
    const request = new ConsumerProfileRequest();
    request.profilePath = profilePath;
    const promise = new Promise<ConsumerProfile>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getConsumerProfileByPath(request)
      .subscribe((response: ConsumerProfileResponse) => {
        if(response.isSuccess) {
          resolve(response.consumerProfile);
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          reject(false);
        }
      });
    });
    return promise;
  }


  addVendorToMyPlaces(vendor: VendorDisplay) {
    const request = new MyPlacesRequest();
    request.vendorId = vendor.id;
    return new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.addVendorToMyPlaces(request).subscribe((response: Response) => {        
        if (response.isSuccess) {
          this._currentUser.addVendorToMyLists(vendor);
          this._myList.push(vendor);
          this.vendorsInMyListSubject.next(this._myList);
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }


  removeVendorFromMyPlaces(vendor: VendorDisplay) {
    const request = new MyPlacesRequest();
    request.vendorId = vendor.id;
    return new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.removeVendorFromMyPlaces(request).subscribe((response: Response) => {
        if (response.isSuccess) {
          this._currentUser.removeVendorFromMyPlaces(vendor);
          this._myList = this._myList.filter(listVendor => listVendor.id != vendor.id);
          this.vendorsInMyListSubject.next(this._myList);
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }


  addReviewToVendor(review) {
    const request = new ReviewRequest();
    request.authorId = this._currentUser?.consumer.id;
    request.rating = review.rating;
    request.body = review.body;
    request.title = review.title;
    request.vendorId = review.vendorId;

    return new Promise<Review>((resolve, reject) => {
      this._neatBoutiqueApiService.addReviewToVendor(request).subscribe((response: ReviewResponse) => {
        if (response.isSuccess) {
          resolve(response.review);
        } else {
          reject(response.errors);
        }
      });
    });
  }
  getReviewsForPrompt() {    
    const request = new Request();
    const promise = new Promise<ReviewDisplay[]>((resolve, reject) => {
    this._neatBoutiqueApiService
      .getSampleOfReviews(request)
      .subscribe((response: ReviewsResponse) => {
        if(response.isSuccess) {
          resolve(response.reviews.map(vendor => new ReviewDisplay(vendor)));
        } else {
          // this.authService.revokeToken();
          reject(false);
        }
      });
    });
    return promise;
  }

  removeReviewFromVendor(review: ReviewDisplay) {
    const request = new ReviewRemoveRequest();
    request.reviewId = review.id;
    request.authorId = review.author.id;

    return new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.removeReviewFromVendor(request).subscribe((response: Response) => {
        if (response.isSuccess) {
          resolve(true);
        } else {
          reject(response.errors);
        }
      });
    });
  }


  updateReviewOnVendor(review: Review) {
    const request = new ReviewUpdateRequest();
    request.reviewId = review.id;
    request.authorId = review.author.id;
    request.rating = review.rating;
    request.body = review.body;
    request.title = review.title;

    return new Promise<ReviewDisplay>((resolve, reject) => {
      this._neatBoutiqueApiService.updateReviewOnVendor(request).subscribe((response: ReviewResponse) => {        
        if (response.isSuccess) {
          resolve(new ReviewDisplay(response.review));
        } else {
          reject(response.errors);
        }
      });
    });
  }

  public uploadConsumerProfileImage(logoBase64Path: string) {    
    var request = new ConsumerImageRequest();
    request.base64Image = logoBase64Path;

    const promise = new Promise<ConsumerProfile>((resolve, reject) => {
      this._neatBoutiqueApiService.uploadConsumerProfileImage(request).subscribe((response: ConsumerProfileResponse) => {
        if(response.isSuccess) {
          // this.vendorEdits.next({
          //   logo: response.vendorProfile.avatar
          // });
          resolve(response.consumerProfile);
        }
      });
    });

    return promise;
  }

  public updateConsumerDescription(description: string) {
    var request = new ConsumerDescriptionRequest();
    request.description = description;

    const promise = new Promise<ConsumerProfile>((resolve, reject) => {
      this._neatBoutiqueApiService.updateConsumerDescription(request).subscribe((response: ConsumerProfileResponse) => {
        if (response.isSuccess) {
          resolve(response.consumerProfile);
        }
      });
    });

    return promise;
  }
  
  public updateBorderColor(color: string) {
    var request = new ConsumerBorderColorRequest();
    request.borderColor = color;

    const promise = new Promise<ConsumerProfile>((resolve, reject) => {
      this._neatBoutiqueApiService.updateConsumerBorderColor(request).subscribe((response: ConsumerProfileResponse) => {
        if (response.isSuccess) {
          this._accountService.setCurrentConsumer(response.consumerProfile);
          resolve(response.consumerProfile);
        }
      });
    });

    return promise;
  }

 

  
}
