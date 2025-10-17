import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnswerDisplay } from '../models/answer-display';
import { PostDisplay } from '../models/post-display';
import { ConsumerProfileActivityDisplay } from '../models/consumer-profile-activity-display';
import { CurrentUserDisplay } from '../models/current-user-display';
import { ReviewDisplay } from '../models/review-display';
import { VendorDisplay } from '../models/vendor-display';
import { CheckInDisplay } from '../models/check-in-display';
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
        console.log('=== CHECK-IN DEBUG START ===');
        console.log('1. Response isSuccess:', response.isSuccess);
        console.log('2. Full API Response object:', JSON.stringify(response, null, 2));
        console.log('3. Response type:', typeof response);
        console.log('4. Response keys:', Object.keys(response));

        if (response.isSuccess) {
          console.log('5. Questions count:', response.questionsAskedCount);
          console.log('6. Answers count:', response.questionsAnsweredCount);
          console.log('7. Reviews count:', response.reviewsCount);

          // Check if check-ins properties exist
          console.log('8. Has checkInsCount property:', 'checkInsCount' in response);
          console.log('9. Has recentCheckIns property:', 'recentCheckIns' in response);
          console.log('10. checkInsCount value:', (response as any).checkInsCount);
          console.log('11. recentCheckIns value:', (response as any).recentCheckIns);
          console.log('12. recentCheckIns type:', typeof (response as any).recentCheckIns);
          console.log('13. recentCheckIns isArray:', Array.isArray((response as any).recentCheckIns));

          var activityDisplay = new ConsumerProfileActivityDisplay();
          activityDisplay.questionsAskedCount = response.questionsAskedCount;
          activityDisplay.questionsAnsweredCount = response.questionsAnsweredCount;
          activityDisplay.reviewsCount = response.reviewsCount;
          activityDisplay.checkInsCount = (response as any).checkInsCount || 0;
          console.log('14. Set activityDisplay.checkInsCount to:', activityDisplay.checkInsCount);

          activityDisplay.recentQuestions = response.recentQuestions.map(x => new PostDisplay(x));
          activityDisplay.recentAnswers = response.recentAnswers.map(x => new PostDisplay(x));
          activityDisplay.recentReviews = response.recentReviews.map(x => new ReviewDisplay(x));

          const rawCheckIns = (response as any).recentCheckIns || [];
          console.log('15. Raw check-ins array length:', rawCheckIns.length);
          console.log('16. Raw check-ins array:', JSON.stringify(rawCheckIns, null, 2));

          if (rawCheckIns.length > 0) {
            console.log('17. First check-in raw data:', JSON.stringify(rawCheckIns[0], null, 2));
            console.log('18. First check-in keys:', Object.keys(rawCheckIns[0]));
          } else {
            console.log('17. No check-ins found in response');
          }

          try {
            activityDisplay.recentCheckIns = rawCheckIns.map((x: any, index: number) => {
              console.log(`19.${index}. Mapping check-in ${index}:`, x);
              console.log(`20.${index}. Check-in vendorId:`, x.vendorId);
              console.log(`21.${index}. Check-in vendorName:`, x.vendorName);
              console.log(`22.${index}. Check-in vendorAvatarUrl:`, x.vendorAvatarUrl);

              const checkIn = new CheckInDisplay(x);
              console.log(`23.${index}. Created CheckInDisplay:`, checkIn);
              console.log(`24.${index}. CheckInDisplay.vendorDisplay:`, checkIn.vendorDisplay);
              console.log(`25.${index}. CheckInDisplay.checkedInDateUtc:`, checkIn.checkedInDateUtc);
              return checkIn;
            });
          } catch (error) {
            console.error('26. ERROR mapping check-ins:', error);
            console.error('27. Error stack:', (error as any).stack);
            activityDisplay.recentCheckIns = [];
          }

          console.log('28. Final activityDisplay.recentCheckIns length:', activityDisplay.recentCheckIns.length);
          console.log('29. Final activityDisplay.recentCheckIns:', activityDisplay.recentCheckIns);
          console.log('30. Final activityDisplay.checkInsCount:', activityDisplay.checkInsCount);
          console.log('31. activityDisplay object keys:', Object.keys(activityDisplay));
          console.log('=== CHECK-IN DEBUG END ===');

          resolve(activityDisplay);
        } else {
          console.error('Response not successful. Errors:', response.errors);
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
