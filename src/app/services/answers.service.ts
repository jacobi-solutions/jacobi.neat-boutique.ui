import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnswerDisplay } from '../models/answer-display';
import { PostDisplay } from '../models/post-display';
import { CurrentUserDisplay } from '../models/current-user-display';
import { AccountsService } from './accounts.service';
import { SelectionVote, AnswerVoteRemoveRequest, AnswerWithGooglePlaceRequest, AnswerWithVendorRequest, PostResponse, GooglePlacesEntity, NeatBoutiqueApiService, NeatBoutiqueEntity, PollAnswerRequest } from './neat-boutique-api.service';
import { UtilService } from './util.service';
import { FeedTypes } from "../constants/feed-types";

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  public questionAnsweredOnPostSubject: BehaviorSubject<PostDisplay> = new BehaviorSubject<PostDisplay>(null);
  public questionAnsweredOnRouteQuestionSubject: BehaviorSubject<PostDisplay> = new BehaviorSubject<PostDisplay>(null);
  public pollVotedOnSubject: BehaviorSubject<PostDisplay> = new BehaviorSubject<PostDisplay>(null);
  private _currentUser: CurrentUserDisplay;
  constructor(private _accountsService: AccountsService, private _util: UtilService, private _neatBoutiqueApiService: NeatBoutiqueApiService) {
    this._accountsService.accountsHaveBeenLoadedSubject.subscribe((haveBeenLoaded) => {
      if(haveBeenLoaded) {
        this._currentUser = this._accountsService.currentUserSubject.getValue();
      }
    });
  }

  answerQuestionWithGoolgePlace(googlePlace: GooglePlacesEntity, postId: string, voteRanking: string, feedType: string) {
    const request = new AnswerWithGooglePlaceRequest();
    request.postId = postId;
    request.voteRanking = voteRanking;
    request.googlePlace = googlePlace;
    request.googleSearchSessionToken = "";


    this._neatBoutiqueApiService
      .answerQuestionWithGooglePlace(request)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          var updatedPost = new PostDisplay(response.post);
          if(feedType === FeedTypes.COMMUNITY) {
            this.questionAnsweredOnPostSubject.next(updatedPost);
          } else if (feedType === FeedTypes.ROUTE) {
            this.questionAnsweredOnRouteQuestionSubject.next(updatedPost);
          }

        } else if (response.errors.find((x) => x.errorCode === "410")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  answerQuestionWithVendor(vendor: NeatBoutiqueEntity, postId: string, voteRanking: string, feedType: string) {
    const request = new AnswerWithVendorRequest();
    request.postId = postId;
    request.voteRanking = voteRanking;
    request.vendor = vendor;

    this._neatBoutiqueApiService
      .answerQuestionWithVendor(request)
      .subscribe((response: PostResponse) => {
        if (response.isSuccess) {
          var updatedPost = new PostDisplay(response.post);
          if(feedType === FeedTypes.COMMUNITY) {
            this.questionAnsweredOnPostSubject.next(updatedPost);
          } else if (feedType === FeedTypes.ROUTE) {
            this.questionAnsweredOnRouteQuestionSubject.next(updatedPost);
          }

        } else if (response.errors.find((x) => x.errorCode === "410")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  removeAnswerVoteFromAnswer(answerVote: SelectionVote, feedType: string) {
    const request = new AnswerVoteRemoveRequest();
    request.answerVote = answerVote;

    this._neatBoutiqueApiService
      .removeAnswerVoteFromAnswer(request)
      .subscribe((response: PostResponse) => {

        if (response.isSuccess) {
          var updatedPost = new PostDisplay(response.post);
          if(feedType === FeedTypes.COMMUNITY) {
            this.questionAnsweredOnPostSubject.next(updatedPost);
          } else if (feedType === FeedTypes.ROUTE) {
            this.questionAnsweredOnRouteQuestionSubject.next(updatedPost);
          }
        } else if (response.errors.find((x) => x.errorCode === "410")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  addVoteToPollAnswer(answerId: string, voteRanking: string) {
    const request = new PollAnswerRequest();
    request.answerId = answerId;
    request.voteRanking = voteRanking;
    // send request
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.addVoteToPollAnswer(request)
        .subscribe((response: PostResponse) => {
          if (response.isSuccess) {
            var updatedPost = new PostDisplay(response.post);
            this.pollVotedOnSubject.next(updatedPost);
            // const updatedPollAnswer = new AnswerDisplay(response.pollAnswer);
            // updatedPollAnswer.postId = answer.postId;
            // this._updateVendorPostWithUpdatedAnswer(updatedPollAnswer);
            resolve(true);
          } else if (response.errors.length > 0) {
            reject(false);
          }
        });
    });
    return promise;
  }


  removeVoteFromPollAnswer(answerVote: SelectionVote) {
    const request = new AnswerVoteRemoveRequest();
    request.answerVote = answerVote;
    // send request
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.removeVoteFromPollAnswer(request)
        .subscribe((response: PostResponse) => {
          if (response.isSuccess) {
            var updatedPost = new PostDisplay(response.post);
            this.pollVotedOnSubject.next(updatedPost);
          //   const updatedPollAnswer = new AnswerDisplay(response.pollAnswer);
          //   // updatedPollAnswer.postId = answer.postId;
          //   this._updateVendorPostWithUpdatedAnswer(updatedPollAnswer);
            resolve(true);
          } else if (response.errors.length > 0) {
            reject(false);
          }
        });
    });
    return promise;
  }

  refreshCurrentUserVotesOnPosts(posts: PostDisplay[]) {
    posts.forEach((post: PostDisplay) => {
      
      post.selections.forEach((answer) => {
        var answerVoteIds: string[] = answer.votes.map(x => x.voter.id);
        answer.didVoteFor = this._currentUser.hasIdInList(answerVoteIds);
      }); 
      post.hasAnswered =  post.selections.some(x => x.didVoteFor);
    });
  }
}
