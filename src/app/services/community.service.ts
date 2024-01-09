import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
// import { AuthService } from "../auth/auth.service";

import { AnswerDisplay } from "../models/answer-display";
import { CommentDisplay } from "../models/comment-display";
import { CommunityCategory } from "../models/community-category";
import { ConsumerPostDisplay } from "../models/consumer-post-display";
import { CurrentUserDisplay } from "../models/current-user-display";
import { EntityDisplay } from "../models/entity-display";
import { CommunityTypes, UserRoleTypes } from "../models/constants";
import { VendorDisplay } from "../models/vendor-display";
import { VendorPostDisplay } from "../models/vendor-post-display";
import { AccountsService } from "./accounts.service";
import {
  Answer,

  ConsumerPost,
  ConsumerPostRequest,

  Comment,
  CommentRequest,
  CommentResponse,

  NeatBoutiqueApiService,
  AnswerSearchRequest,
  NeatBoutiqueEntity,
  AnswerVoteRemoveRequest,
  ConsumerProfile,
  VendorProfile,
  CommentRemoveRequest,
  CommentLikeAddRequest,
  CommentLikeRemoveRequest,
  ConsumerPostResponse,
  AnswerWithVendorRequest,
  GooglePlacesEntity,
  AnswerWithGooglePlaceRequest,
  AnswerSearchResponse,
  VendorProfileRequest,
  VendorProfileResponse,
  VendorProfilesResponse,
  VendorProfilesRequest,
  VendorPost,
  PollAnswerRequest,
  VendorPostResponse,
  CommunityRequest,
  CommunityResponse,
  PollAnswerResponse,
  HeroAdTemplate,
  ConsumerFeedSettingsRequest,
  AnswerVote,
} from "./neat-boutique-api.service";
import { UtilService } from "./util.service";
import { AnswersService } from "./answers.service";
import { ConsumerService } from "./consumer.service";
import { AuthService } from "../auth/auth.service";


export class CommunityDisplay {
  constructor(consumerPosts: ConsumerPostDisplay[] = [], vendorPosts: VendorPostDisplay[] = [],
      recentConsumerPosts: ConsumerPostDisplay[] = [], heroAds: HeroAdTemplate[] = []) {
    this.consumerPosts = consumerPosts;
    this.vendorPosts = vendorPosts;
    this.recentConsumerPosts = recentConsumerPosts;
    this.heroAds = heroAds;
  }
  consumerPosts: ConsumerPostDisplay[];
  vendorPosts: VendorPostDisplay[];
  recentConsumerPosts: ConsumerPostDisplay[];
  heroAds: HeroAdTemplate[];
  canLoadMorePosts: boolean;
};


@Injectable({
  providedIn: "root",
})
export class CommunityService {

  private _currentUser: CurrentUserDisplay;
  // private _vendorPosts: VendorPostDisplay[] = [];
  private _recentConsumerPosts: ConsumerPostDisplay[];
  private _selectedCommunityNames: string[];
  private _pageCount: number;
  public communities: CommunityCategory[];
  public currentPage: number = 0;
  private _communityDisplay = new CommunityDisplay();
  public communityDisplaySubject: BehaviorSubject<CommunityDisplay> = new BehaviorSubject<CommunityDisplay>(null);

  public consumerPostsPerPage: number = 12;
  public recentPostsPerPage: number = 3;
  public userHasSeenNonEditableModal: boolean;

  constructor(
    private _neatBoutiqueApiService: NeatBoutiqueApiService,
    private _accountsService: AccountsService,
    private _util: UtilService,
    private _answersService: AnswersService,
    private _consumerService: ConsumerService
  ) {
    this.loadStaticCommunities();
    this._accountsService.accountsHaveBeenLoadedSubject.subscribe((haveBeenLoaded) => {
      if(haveBeenLoaded) {
        this._currentUser = this._accountsService.currentUserSubject.getValue();

        if(this._currentUser?.feedCategoriesToShow) {

          this.communities.forEach(x => {
            var showCategory =  x.isSelected = this._currentUser.feedCategoriesToShow.some(y => y == x.name);
            x.isSelected = showCategory;
          });
          this.loadPostsByCommunityNames(this.communities.filter(x => x.isSelected).map(x => x.name));
        }
        
        // this.emitCommunityDisplaySubject();
      }
    });

    
    this.loadPostsByCommunityNames(this.communities.filter(x => x.isSelected).map(x => x.name));
    this._answersService.questionAnsweredOnPostSubject.subscribe((post: ConsumerPostDisplay) => {
      if(post) {
        var updatedPosts = this.updateConsumerPostInPosts(post, this._communityDisplay.consumerPosts);
        this._communityDisplay.consumerPosts = [...updatedPosts];
        this.emitCommunityDisplaySubject();
      }
    });
  }

  updateShownCommunities() {
    var communityNames = this.communities.filter(x => x.isSelected).map(x => x.name);

    this._accountsService.updateFeedSettings(communityNames);
    
    this.loadPostsByCommunityNames(communityNames);
  }

  getConsumerPostById(specificPostId: string) {
    var promise = new Promise<ConsumerPostDisplay>((resolve, reject) => {
      var request = new ConsumerPostRequest();
      request.postId = specificPostId;
      this._neatBoutiqueApiService .getConsumerPostById(request).subscribe((response: ConsumerPostResponse) => {
        if(response.isSuccess) {
          resolve(new ConsumerPostDisplay(response.post))
        }
      });
    });

    return promise;
    
  }
  

  private loadPostsByCommunityNames(communityNames: string[]) {
    this._selectedCommunityNames = communityNames;
    const request = new CommunityRequest();
    request.communityNames = communityNames;
    request.includeRecentPostsCount = this.recentPostsPerPage;
    request.pageSize = this.consumerPostsPerPage;
    request.pageNumber = 0;

    this._neatBoutiqueApiService
      .getAllDataForCommunities(request)
      .subscribe((response: CommunityResponse) => {

        if (response.isSuccess) {
          this._communityDisplay.canLoadMorePosts = response.consumerPosts?.length === this.consumerPostsPerPage;
          this._communityDisplay.consumerPosts = response.consumerPosts.map(x => new ConsumerPostDisplay(x));
          this._communityDisplay.recentConsumerPosts = response.recentConsumerPosts.map(x => new ConsumerPostDisplay(x));
          this._communityDisplay.vendorPosts = response.vendorPosts.map(x => new VendorPostDisplay(x));
          this._communityDisplay.heroAds = response.heroAds; //.map(ad => new HeroAdTemplate(ad));

          this.emitCommunityDisplaySubject();
        } else {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }


  loadMorePosts() {
    // const isNewCommunity = this._selectedCommunities !== communityNames;
    // if (isNewCommunity) {
    //   this.currentPage = 0;
    //   this._communityDisplay.consumerPosts = [];
    // } else {
      this.currentPage += 1;
    //}

    const request = new CommunityRequest();
    request.communityNames = this._selectedCommunityNames;
    request.includeRecentPostsCount = this.recentPostsPerPage;
    request.pageSize = this.consumerPostsPerPage;
    request.pageNumber = this.currentPage;

    this._neatBoutiqueApiService
      .getAllDataForCommunities(request)
      .subscribe((response: CommunityResponse) => {
        if (response.isSuccess) {
          this._communityDisplay.canLoadMorePosts = response.consumerPosts?.length === this.consumerPostsPerPage;
          this._communityDisplay.consumerPosts = [...this._communityDisplay.consumerPosts, ...response.consumerPosts.map(x => new ConsumerPostDisplay(x))];
          this._communityDisplay.recentConsumerPosts = response.recentConsumerPosts.map(x => new ConsumerPostDisplay(x));
          this._communityDisplay.vendorPosts = [...this._communityDisplay.vendorPosts, ...response.vendorPosts.map(x => new VendorPostDisplay(x))];

          this.emitCommunityDisplaySubject();
        } else {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  // private _includePolls(consumerPosts: ConsumerPost[], vendorPosts: VendorPost[]) {
  //   const includePollPerPostCount = Math.floor(consumerPosts.length / vendorPosts.length);
  //   let pollCounter = 0;
  //   const sortedConsumerPosts = consumerPosts.sort(this._util.sortByCreatedDateUtc);
  //   const sortedVendorPosts = vendorPosts.sort(this._util.sortByCreatedDateUtc);
  //   const posts = sortedConsumerPosts.map((post: ConsumerPost, i: number) => {
  //     // return array of both post type (this gets flattened after the map)
  //     if (((i + 1) % includePollPerPostCount === 0)) {
  //       return [
  //         new ConsumerPostDisplay(post),
  //         new VendorPostDisplay(sortedVendorPosts[pollCounter++]),
  //       ];
  //     }
  //     return new ConsumerPostDisplay(post);
  //   }).flat();
  //   // if loop ends before last poll gets addeed, add it to the end
  //   if (pollCounter === (vendorPosts.length - 1)) {
  //     return [...posts, new VendorPostDisplay(sortedVendorPosts[vendorPosts.length - 1])];
  //   }
  //   return posts;
  // }

  updateConsumerPostInPosts(post: ConsumerPostDisplay, posts: ConsumerPostDisplay[]) {
    var currentPost = posts.find(x => x.id === post.id);
    var indexOfCurrentPost = posts.indexOf(currentPost);
    posts[indexOfCurrentPost] = post;

    return posts;
  }

  // private _updateConsumerPostWithUpdatedAnswer(answer: AnswerDisplay) {

  //   this._communityDisplay.consumerPosts = this._answersService.updateAnswerOnPosts(this._communityDisplay.consumerPosts, answer);
    
  //   this._communityDisplay.consumerPosts = [...this._communityDisplay.consumerPosts];
  //   this.emitCommunityDisplaySubject();
  // }

  // updateAnswerOnPosts(posts: ConsumerPostDisplay[], answer: AnswerDisplay) {
  //   return posts.map((post: ConsumerPostDisplay) => {
  //     if (post.id === answer.postId) {
  //       let oldAnswerToRemoveId = null;
  //       // remove previous vote from post
  //       post.answers.forEach((answer: AnswerDisplay) => {
  //         answer.votes = answer.votes.filter(x => !this._currentUser.hasId(x.id));
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

  

  // needs to be authorized
  createConsumerPost(post: ConsumerPost) {
    const request = new ConsumerPostRequest();

    request.post = post;
    this._neatBoutiqueApiService
      .createConsumerPost(request)
      .subscribe((response: ConsumerPostResponse) => {

        if (response.isSuccess) {
          // this.authService.setToken(response.token);
          this.loadPostsByCommunityNames(this._selectedCommunityNames);
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  createCommentOnPost(comment: Comment) {
    const request = new CommentRequest();
    request.authorId = comment.author.id;
    request.authorRole = comment.author.role;
    request.body = comment.body;
    request.postId = comment.postId;

    const promise = new Promise<CommentDisplay>((resolve, reject) => {
      this._neatBoutiqueApiService
        .addCommentToPost(request)
        .subscribe((response: CommentResponse) => {
          if (response.isSuccess) {
            // this.authService.setToken(response.token);
            resolve(new CommentDisplay(response.comment));
          } else if (response.errors.find((x) => x.errorCode === "409")) {
            // this.authService.revokeToken();
            // reject(false);
          }
        });
    });
    return promise;
  }

  removeCommentFromPost(comment: Comment) {
    const request = new CommentRemoveRequest();
    request.authorId = comment.author.id;
    request.commentId = comment.id;

    const promise = new Promise<CommentDisplay>((resolve, reject) => {
      this._neatBoutiqueApiService
        .removeCommentFromPost(request)
        .subscribe((response: CommentResponse) => {
          if (response.isSuccess) {
            // this.authService.setToken(response.token);
            resolve(new CommentDisplay(response.comment));
          } else if (response.errors.find((x) => x.errorCode === "409")) {
            // this.authService.revokeToken();
            // reject(false);
          }
        });
    });
    return promise;
  }

  likeComment(comment: Comment, likerId: string) {
    const request = new CommentLikeAddRequest();
    request.commentId = comment.id;
    request.likerId = likerId;
    request.likerRole = UserRoleTypes.CONSUMER;
    const promise = new Promise<CommentDisplay>((resolve, reject) => {
      this._neatBoutiqueApiService
        .addLikeToComment(request)
        .subscribe((response: CommentResponse) => {
          if (response.isSuccess) {
            // this.authService.setToken(response.token);
            resolve(new CommentDisplay(response.comment));
            // resolve(response.comment.map((x) => new CommentDisplay(x))[0]);
          } else if (response.errors.find((x) => x.errorCode === "409")) {
            // this.authService.revokeToken();
            // reject(false);
          }
        });
    });
    return promise;
  }

  unlikeComment(comment: Comment) {
    if (!comment?.id) {
      return null;
    }

    const request = new CommentLikeRemoveRequest();
    request.commentId = comment.id;
    request.likerId = this._currentUser?.consumer?.id

    const promise = new Promise<CommentDisplay>((resolve, reject) => {
      this._neatBoutiqueApiService
        .removeLikeFromComment(request)
        .subscribe((response: CommentResponse) => {
          if (response.isSuccess) {
            // this.authService.setToken(response.token);
            resolve(new CommentDisplay(response.comment));
          } else if (response.errors.find((x) => x.errorCode === "409")) {
            // this.authService.revokeToken();
            // reject(false);
          }
        });
    });
    return promise;
  }

  autocompleteSearchForAnswer(venderSearch: { communityName: string, searchString: string }) {
    const request = new AnswerSearchRequest();
    request.communityName = venderSearch.communityName;
    request.searchString = venderSearch.searchString;
    const promise = new Promise<EntityDisplay[]>((resolve, reject) => {
      this._neatBoutiqueApiService
        .autocompleteSearchForAnswer(request)
        .subscribe((response: AnswerSearchResponse) => {
          if (response.isSuccess) {
            // this.authService.setToken(response.token);
            resolve([...response.vendors.map(x => new EntityDisplay(x)), ...response.googlePlaces.map(x => new EntityDisplay(x))]);
          } else if (response.errors.find((x) => x.errorCode === "409")) {
            // this.authService.revokeToken();
            // reject(false);
          }
        });
    });
    return promise;
  }

  getCommunityCategoryByNameDisplay(communityName: string) {
    var community = this.communities.find(x => x.name === communityName);
    return community;
  }

  addVoteToPollAnswer(answer: AnswerDisplay) {
    const request = new PollAnswerRequest();
    request.pollAnswerId = answer.id;
    request.postId = answer.postId;
    // send request
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.addVoteToPollAnswer(request)
        .subscribe((response: PollAnswerResponse) => {
          if (response.isSuccess) {
            const updatedPollAnswer = new AnswerDisplay(response.pollAnswer);
            updatedPollAnswer.postId = answer.postId;
            this._updateVendorPostWithUpdatedAnswer(updatedPollAnswer);
            resolve(true);
          } else if (response.errors.length > 0) {
            reject(false);
          }
        });
    });
    return promise;
  }


  removeVoteFromPollAnswer(answer: AnswerDisplay) {
    const request = new PollAnswerRequest();
    request.pollAnswerId = answer.id;
    request.postId = answer.postId;
    // send request
    const promise = new Promise<boolean>((resolve, reject) => {
      this._neatBoutiqueApiService.removeVoteFromPollAnswer(request)
        .subscribe((response: PollAnswerResponse) => {
          if (response.isSuccess) {
            const updatedPollAnswer = new AnswerDisplay(response.pollAnswer);
            // updatedPollAnswer.postId = answer.postId;
            this._updateVendorPostWithUpdatedAnswer(updatedPollAnswer);
            resolve(true);
          } else if (response.errors.length > 0) {
            reject(false);
          }
        });
    });
    return promise;
  }

  private _updateVendorPostWithUpdatedAnswer(answer: AnswerDisplay) {

    this._communityDisplay.vendorPosts = this._communityDisplay.vendorPosts.map((post: VendorPostDisplay) => {
      if (post.id === answer.postId) {
        
        // remove previous vote from post
        post.answers.forEach((answer: AnswerDisplay) => {
          answer.votes = answer.votes.filter(x => !this._currentUser.hasId(x.voter.id));
        });

        const answers = post.answers.filter(x => x.id !== answer.id);
        post.answers = [...answers, answer];
      }

      post.answers = this._util.normalizedAnswersForChartMinMax(post.answers);

      return post;
    });

    this._communityDisplay.vendorPosts = [...this._communityDisplay.vendorPosts];
    this.emitCommunityDisplaySubject();
  }

  emitCommunityDisplaySubject() {
    var accountsHasBeenLoaded = this._accountsService.accountsHaveBeenLoadedSubject.getValue();
    if (accountsHasBeenLoaded) {
      this._answersService.refreshCurrentUserVotesOnPosts(this._communityDisplay.consumerPosts);
      this._answersService.refreshCurrentUserVotesOnPosts(this._communityDisplay.vendorPosts);
    }

    this.communityDisplaySubject.next(this._communityDisplay);
  }

  loadStaticCommunities() {
    this.communities = [
      new CommunityCategory({
        name: CommunityTypes.BOUTIQUES_BEAUTY,
        icon: 'storefront',
        hexColor: '#409195',
        categoryLink: '',
        isSelected: true
      }),
      new CommunityCategory({
        name: CommunityTypes.FOOD_DRINK,
        icon: 'restaurant',
        hexColor: '#ffbc00',
        categoryLink: '',
        isSelected: true
      }),
      new CommunityCategory({
        name: CommunityTypes.TRAVEL_ADVENTURE,
        icon: 'airplane',
        hexColor: '#916dd5',
        categoryLink: '',
        isSelected: true
      }),
      new CommunityCategory({
        name: CommunityTypes.NIGHTLIFE_ENTERTAINMENT,
        icon: 'beer',
        hexColor: '#dc7730',
        categoryLink: '',
        isSelected: true
      }),
      new CommunityCategory({
        name: CommunityTypes.HEALTH_WELLNESS,
        icon: 'heart',
        hexColor: '#93290f',
        categoryLink: '',
        isSelected: true
      }),
      new CommunityCategory({
        name: CommunityTypes.MAINTENANCE_REPAIR,
        icon: 'build',
        hexColor: '#65c2db',
        categoryLink: '',
        isSelected: true
      }),
      new CommunityCategory({
        name: CommunityTypes.CHURCH_STATE,
        icon: 'school',
        hexColor: '#9eaebe',
        categoryLink: '',
        isSelected: true
      }),
      new CommunityCategory({
        name: CommunityTypes.SERVICES_MORE,
        icon: 'compass',
        hexColor: '#013e43',
        categoryLink: '',
        isSelected: true
      })
    ];
  }

}
