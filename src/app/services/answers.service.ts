import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnswerDisplay } from '../models/answer-display';
import { ConsumerPostDisplay } from '../models/consumer-post-display';
import { CurrentUserDisplay } from '../models/current-user-display';
import { VendorPostDisplay } from '../models/vendor-post-display';
import { AccountsService } from './accounts.service';
import { AnswerVote, AnswerVoteRemoveRequest, AnswerWithGooglePlaceRequest, AnswerWithVendorRequest, ConsumerPostResponse, ConsumerPostsResponse, GooglePlacesEntity, NeatBoutiqueApiService, NeatBoutiqueEntity } from './neat-boutique-api.service';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {

  public questionAnsweredOnPostSubject: BehaviorSubject<ConsumerPostDisplay> = new BehaviorSubject<ConsumerPostDisplay>(null);
  private _currentUser: CurrentUserDisplay;
  constructor(private _accountsService: AccountsService, private _util: UtilService, private _neatBoutiqueApiService: NeatBoutiqueApiService) {
    this._accountsService.accountsHaveBeenLoadedSubject.subscribe((haveBeenLoaded) => {
      if(haveBeenLoaded) {
        this._currentUser = this._accountsService.currentUserSubject.getValue();
      }
    });
  }

  answerQuestionWithGoolgePlace(googlePlace: GooglePlacesEntity, postId: string, voteRanking: string) {
    const request = new AnswerWithGooglePlaceRequest();
    request.postId = postId;
    request.voteRanking = voteRanking;
    request.googlePlace = googlePlace;
    request.googleSearchSessionToken = "";


    this._neatBoutiqueApiService
      .answerQuestionWithGooglePlace(request)
      .subscribe((response: ConsumerPostResponse) => {
        if (response.isSuccess) {
          var updatedPost = new ConsumerPostDisplay(response.post);
          this.questionAnsweredOnPostSubject.next(updatedPost);

        } else if (response.errors.find((x) => x.errorCode === "410")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  answerQuestionWithVendor(vendor: NeatBoutiqueEntity, postId: string, voteRanking: string) {
    const request = new AnswerWithVendorRequest();
    request.postId = postId;
    request.voteRanking = voteRanking;
    request.vendor = vendor;

    this._neatBoutiqueApiService
      .answerQuestionWithVendor(request)
      .subscribe((response: ConsumerPostResponse) => {
        if (response.isSuccess) {
          var updatedPost = new ConsumerPostDisplay(response.post);
          this.questionAnsweredOnPostSubject.next(updatedPost);
        } else if (response.errors.find((x) => x.errorCode === "410")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  // updateAnswerOnPosts(posts: ConsumerPostDisplay[], answer: AnswerDisplay) {
  //   return posts.map((post: ConsumerPostDisplay) => {
  //     if (post.id === answer.postId) {
  //       let oldAnswerToRemoveId = null;
  //       // remove previous vote from post
  //       post.answers.forEach((answer: AnswerDisplay) => {
  //         answer.votes = answer.votes.filter(x => !this._currentUser.hasId(x.voter.id));
  //         // answer.voteTotal = answer.votes.length
  //         if (answer.votes.length === 0) {
  //           oldAnswerToRemoveId = answer.id;
  //         }
  //       });

  //       // remove answer that has 0 votes
  //       if (oldAnswerToRemoveId) {
  //         post.answers = post.answers.filter(x => x.id !== oldAnswerToRemoveId);
  //       }

  //       const answers = post.answers.filter(x => x.id !== answer.id);
  //       post.answers = [...answers, answer];
  //     }

  //     post.answers = <AnswerDisplay[]>this._util.normalizedAnswersForChartMinMax(post.answers);

  //     return post;
  //   });
  // }

  removeAnswerVoteFromAnswer(answerVote: AnswerVote) {
    const request = new AnswerVoteRemoveRequest();
    request.answerVote = answerVote;

    this._neatBoutiqueApiService
      .removeAnswerVoteFromAnswer(request)
      .subscribe((response: ConsumerPostResponse) => {

        if (response.isSuccess) {
          var updatedPost = new ConsumerPostDisplay(response.post);
          this.questionAnsweredOnPostSubject.next(updatedPost);
        } else if (response.errors.find((x) => x.errorCode === "410")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  refreshCurrentUserVotesOnPosts(posts: ConsumerPostDisplay[] | VendorPostDisplay[]) {
    posts.forEach((post: ConsumerPostDisplay | VendorPostDisplay) => {
      
      post.answers.forEach((answer) => {
        var answerVoteIds: string[] = answer.votes.map(x => x.voter.id);
        answer.didVoteFor = this._currentUser.hasIdInList(answerVoteIds);
      }); 
      post.hasAnswered =  post.answers.some(x => x.didVoteFor);
    });
  }
}
