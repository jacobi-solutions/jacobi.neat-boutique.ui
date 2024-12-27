import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
// import { AuthService } from "../auth/auth.service";

import { AnswerDisplay } from "../models/answer-display";
import { CommentDisplay } from "../models/comment-display";
import { Category } from "../models/category";
import { PostDisplay } from "../models/post-display";
import { CurrentUserDisplay } from "../models/current-user-display";
import { EntityDisplay } from "../models/entity-display";
import { CategoryTypes, UserRoleTypes } from "../models/constants";
import { VendorDisplay } from "../models/vendor-display";
import { AccountsService } from "./accounts.service";
import {
  Selection,

  Post,

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
  PostResponse,
  AnswerWithVendorRequest,
  GooglePlacesEntity,
  AnswerWithGooglePlaceRequest,
  AnswerSearchResponse,
  VendorProfileRequest,
  VendorProfileResponse,
  VendorProfilesResponse,
  VendorProfilesRequest,
  PollAnswerRequest,
  CategoryRequest,
  CategoryResponse,
  HeroAdTemplate,
  ConsumerFeedSettingsRequest,
  SelectionVote,
  PostRequest,
  RouteResponse,
  RouteRequest,
  MyVisitsResponse,
  RouteSelectionVisit,
} from "./neat-boutique-api.service";
import { UtilService } from "./util.service";
import { AnswersService } from "./answers.service";
import { ConsumerService } from "./consumer.service";
import { AuthService } from "../auth/auth.service";
import { RouteDisplay } from "../models/route-display";
import { Visitor } from "@angular/compiler";


export class CategoryDisplay {
  constructor(consumerPosts: PostDisplay[] = [], vendorPosts: PostDisplay[] = [],
      recentConsumerPosts: PostDisplay[] = [], heroAds: HeroAdTemplate[] = []) {
    this.consumerPosts = consumerPosts;
    this.vendorPosts = vendorPosts;
    this.recentConsumerPosts = recentConsumerPosts;
    this.heroAds = heroAds;
  }
  consumerPosts: PostDisplay[];
  vendorPosts: PostDisplay[];
  recentConsumerPosts: PostDisplay[];
  heroAds: HeroAdTemplate[];
  canLoadMorePosts: boolean;
};


@Injectable({
  providedIn: "root",
})
export class CategoryService {

  private _currentUser: CurrentUserDisplay;
  // private _vendorPosts: VendorPostDisplay[] = [];
  private _recentConsumerPosts: PostDisplay[];
  private _selectedCategoryNames: string[];
  private _pageCount: number;
  public categories: Category[];
  public currentPage: number = 0;
  private _categoryDisplay = new CategoryDisplay();
  public categoryDisplaySubject: BehaviorSubject<CategoryDisplay> = new BehaviorSubject<CategoryDisplay>(null);
  public newRouteQuestionSubject: BehaviorSubject<PostDisplay> = new BehaviorSubject<PostDisplay>(null);
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
    this.loadStaticCategories();
    this._accountsService.accountsHaveBeenLoadedSubject.subscribe((haveBeenLoaded) => {
      if(haveBeenLoaded) {
        this._currentUser = this._accountsService.currentUserSubject.getValue();

        if(this._currentUser?.feedCategoriesToShow) {

          this.categories.forEach(x => {
            var showCategory =  x.isSelected = this._currentUser.feedCategoriesToShow.some(y => y == x.name);
            x.isSelected = showCategory;
          });
          this.loadPostsByCategoryNames(this.categories.filter(x => x.isSelected).map(x => x.name));
        }
        
        // this.emitCategoryDisplaySubject();
      }
    });

    
    this.loadPostsByCategoryNames(this.categories.filter(x => x.isSelected).map(x => x.name));
    this._answersService.questionAnsweredOnPostSubject.subscribe((post: PostDisplay) => {
      if(post) {
        var updatedPosts = this.updateConsumerPostInPosts(post, this._categoryDisplay.consumerPosts);
        this._categoryDisplay.consumerPosts = [...updatedPosts];
        this.emitCategoryDisplaySubject();
      }
    });

    this._answersService.pollVotedOnSubject.subscribe((post: PostDisplay) => {
      if(post) {
        var updatedPosts = this.updateVendorPostInPosts(post, this._categoryDisplay.vendorPosts);
        this._categoryDisplay.vendorPosts = [...updatedPosts];
        this.emitCategoryDisplaySubject();
      }
    });
  }

  updateShownCategories() {
    var categoryNames = this.categories.filter(x => x.isSelected).map(x => x.name);

    this._accountsService.updateFeedSettings(categoryNames);
    
    this.loadPostsByCategoryNames(categoryNames);
  }

  getPostById(specificPostId: string) {
    var promise = new Promise<PostDisplay>((resolve, reject) => {
      var request = new PostRequest();
      request.postId = specificPostId;
      this._neatBoutiqueApiService.getPostById(request).subscribe((response: PostResponse) => {
        if(response.isSuccess) {
          resolve(new PostDisplay(response.post))
        }
      });
    });

    return promise;
    
  }

  getRouteById(routeId: string) {
    var promise = new Promise<RouteDisplay>((resolve, reject) => {
      var request = new RouteRequest();
      request.routeId = routeId;
      this._neatBoutiqueApiService.getRouteById(request).subscribe((response: RouteResponse) => {
        if(response.isSuccess) {
          resolve(new RouteDisplay(response.route))
        }
      });
    });

    return promise;
    
  }

  getMyVisitsOnRouteByRouteById(routeId: string) {
    var promise = new Promise<RouteSelectionVisit[]>((resolve, reject) => {
      var request = new RouteRequest();
      request.routeId = routeId;
      this._neatBoutiqueApiService.getMyVisitsOnRouteByRouteId(request).subscribe((response: MyVisitsResponse) => {
        if(response.isSuccess) {
          resolve(response.myVisits)
        }
      });
    });

    return promise;
    
  }
  

  private loadPostsByCategoryNames(categoryNames: string[]) {
    this._selectedCategoryNames = categoryNames;
    const request = new CategoryRequest();
    request.categoryNames = categoryNames;
    request.includeRecentPostsCount = this.recentPostsPerPage;
    request.pageSize = this.consumerPostsPerPage;
    request.pageNumber = 0;

    this._neatBoutiqueApiService
      .getAllDataForCategories(request)
      .subscribe((response: CategoryResponse) => {

        if (response.isSuccess) {
          this._categoryDisplay.canLoadMorePosts = response.consumerQuestions?.length === this.consumerPostsPerPage;
          this._categoryDisplay.consumerPosts = response.consumerQuestions.map(x => new PostDisplay(x));
          this._categoryDisplay.recentConsumerPosts = response.recentConsumerQuestions.map(x => new PostDisplay(x));
          this._categoryDisplay.vendorPosts = response.vendorPolls.map(x => new PostDisplay(x));
          this._categoryDisplay.heroAds = response.heroAds; //.map(ad => new HeroAdTemplate(ad));

          this.emitCategoryDisplaySubject();
        } else {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }


  loadMorePosts() {
    // const isNewCategory = this._selectedCategories !== categoryNames;
    // if (isNewCategory) {
    //   this.currentPage = 0;
    //   this._categoryDisplay.consumerPosts = [];
    // } else {
      this.currentPage += 1;
    //}

    const request = new CategoryRequest();
    request.categoryNames = this._selectedCategoryNames;
    request.includeRecentPostsCount = this.recentPostsPerPage;
    request.pageSize = this.consumerPostsPerPage;
    request.pageNumber = this.currentPage;

    this._neatBoutiqueApiService
      .getAllDataForCategories(request)
      .subscribe((response: CategoryResponse) => {
        if (response.isSuccess) {
          this._categoryDisplay.canLoadMorePosts = response.consumerQuestions?.length === this.consumerPostsPerPage;
          this._categoryDisplay.consumerPosts = [...this._categoryDisplay.consumerPosts, ...response.consumerQuestions.map(x => new PostDisplay(x))];
          this._categoryDisplay.recentConsumerPosts = response.recentConsumerQuestions.map(x => new PostDisplay(x));
          this._categoryDisplay.vendorPosts = [...this._categoryDisplay.vendorPosts, ...response.vendorPolls.map(x => new PostDisplay(x))];

          this.emitCategoryDisplaySubject();
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

  updateConsumerPostInPosts(post: PostDisplay, posts: PostDisplay[]) {
    var currentPost = posts.find(x => x.id === post.id);
    var indexOfCurrentPost = posts.indexOf(currentPost);
    posts[indexOfCurrentPost] = post;

    return posts;
  }

  updateVendorPostInPosts(post: PostDisplay, posts: PostDisplay[]) {
    var currentPost = posts.find(x => x.id === post.id);
    var indexOfCurrentPost = posts.indexOf(currentPost);
    posts[indexOfCurrentPost] = post;

    return posts;
  }

  

  // needs to be authorized
  createConsumerPost(post: Post) {
    const request = new PostRequest();

    request.post = post;
    this._neatBoutiqueApiService
      .createConsumerQuestion(request)
      .subscribe((response: PostResponse) => {

        if (response.isSuccess) {
          // this.authService.setToken(response.token);
          this.loadPostsByCategoryNames(this._selectedCategoryNames);
        } else if (response.errors.find((x) => x.errorCode === "409")) {
          // this.authService.revokeToken();
          // reject(false);
        }
      });
  }

  createRouteQuestion(post: Post) {
    const request = new PostRequest();

    request.post = post;
    this._neatBoutiqueApiService
      .createRouteFeedQuestion(request)
      .subscribe((response: PostResponse) => {

        if (response.isSuccess) {
          this.newRouteQuestionSubject.next(new PostDisplay(response.post));
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

  autocompleteSearchForAnswer(venderSearch: { categoryName: string, searchString: string }) {
    const request = new AnswerSearchRequest();
    request.categoryName = venderSearch.categoryName;
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

  getCategoryByNameDisplay(categoryName: string) {
    var category = this.categories.find(x => x.name === categoryName);
    return category;
  }

  

  private _updateVendorPostWithUpdatedAnswer(answer: AnswerDisplay) {

    this._categoryDisplay.vendorPosts = this._categoryDisplay.vendorPosts.map((post: PostDisplay) => {
      if (post.id === answer.postId) {
        
        // remove previous vote from post
        post.selections.forEach((answer: AnswerDisplay) => {
          answer.votes = answer.votes.filter(x => !this._currentUser.hasId(x.voter.id));
        });

        const selections = post.selections.filter(x => x.id !== answer.id);
        post.selections = [...selections, answer];
      }

      post.selections = this._util.normalizedAnswersForChartMinMax(post.selections);

      return post;
    });

    this._categoryDisplay.vendorPosts = [...this._categoryDisplay.vendorPosts];
    this.emitCategoryDisplaySubject();
  }

  emitCategoryDisplaySubject() {
    var accountsHasBeenLoaded = this._accountsService.accountsHaveBeenLoadedSubject.getValue();
    if (accountsHasBeenLoaded) {
      this._answersService.refreshCurrentUserVotesOnPosts(this._categoryDisplay.consumerPosts);
      this._answersService.refreshCurrentUserVotesOnPosts(this._categoryDisplay.vendorPosts);
    }

    this.categoryDisplaySubject.next(this._categoryDisplay);
  }

  loadStaticCategories() {
    this.categories = [
      new Category({
        name: CategoryTypes.BOUTIQUES_BEAUTY,
        icon: 'storefront',
        hexColor: '#409195',
        categoryLink: '',
        isSelected: true
      }),
      new Category({
        name: CategoryTypes.FOOD_DRINK,
        icon: 'restaurant',
        hexColor: '#ffbc00',
        categoryLink: '',
        isSelected: true
      }),
      new Category({
        name: CategoryTypes.TRAVEL_ADVENTURE,
        icon: 'airplane',
        hexColor: '#916dd5',
        categoryLink: '',
        isSelected: true
      }),
      new Category({
        name: CategoryTypes.NIGHTLIFE_ENTERTAINMENT,
        icon: 'beer',
        hexColor: '#dc7730',
        categoryLink: '',
        isSelected: true
      }),
      new Category({
        name: CategoryTypes.HEALTH_WELLNESS,
        icon: 'heart',
        hexColor: '#93290f',
        categoryLink: '',
        isSelected: true
      }),
      new Category({
        name: CategoryTypes.MAINTENANCE_REPAIR,
        icon: 'build',
        hexColor: '#65c2db',
        categoryLink: '',
        isSelected: true
      }),
      new Category({
        name: CategoryTypes.CHURCH_STATE,
        icon: 'school',
        hexColor: '#9eaebe',
        categoryLink: '',
        isSelected: true
      }),
      new Category({
        name: CategoryTypes.SERVICES_MORE,
        icon: 'compass',
        hexColor: '#013e43',
        categoryLink: '',
        isSelected: true
      })
    ];
  }

}
