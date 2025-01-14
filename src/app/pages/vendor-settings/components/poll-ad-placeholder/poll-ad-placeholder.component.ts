import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostDisplay as PostDisplay } from 'src/app/models/post-display';
import { CategoryTypes, PostTypes, SubscriptionPlanTypes } from 'src/app/models/constants';
import { CategoryDisplay, CategoryService } from 'src/app/services/category.service';
import { NeatBoutiqueEntity, Comment, VendorProfile, Selection, SelectionVote, Post } from 'src/app/services/neat-boutique-api.service';
import { UtilService } from 'src/app/services/util.service';
import { CommentDisplay } from 'src/app/models/comment-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { VendorSubscriptionService } from 'src/app/services/vendor-subscription.service';

@Component({
  selector: 'app-poll-ad-placeholder',
  templateUrl: './poll-ad-placeholder.component.html',
  styleUrls: ['./poll-ad-placeholder.component.scss'],
})
export class PollAdPlaceholderComponent implements OnInit {
  @Input() vendor: VendorDisplay;
  public examplePoll: PostDisplay;
  private _subscriptionPlanTypes = SubscriptionPlanTypes;
  public get subscriptionPlanTypes() {
    return this._subscriptionPlanTypes;
  }
  public set subscriptionPlanTypes(value) {
    this._subscriptionPlanTypes = value;
  }


  constructor(private _utilService: UtilService, private _categoryService: CategoryService,
    private _vendorSubscriptionService: VendorSubscriptionService, private _router: Router) {

     
  }
  ngOnInit() {
    this._loadExamplePoll();    
  }

  goToPollAds() {
    if(this.vendor?.vendorSubscriptionPlan === SubscriptionPlanTypes.VENDOR_STANDARD) {
      this.changeSubscription();
    } else {
      this._router.navigateByUrl('/vendor-settings/poll-ads', { state: this.vendor });
    }
  }

  changeSubscription() {
    this._vendorSubscriptionService.setVendorForPricingPage(this.vendor);
    this._router.navigateByUrl('/pricing');
  } 

  private _loadExamplePoll() {
    // TODO: update with real service when it's ready
    // this._categoryService.loadPostsByCategoryNames(CategoryTypes.BOUTIQUES_BEAUTY);
    // this._categoryService.categoryDisplaySubject.subscribe((display: CategoryDisplay) => {  

      // a post with 5+ answers
      this.examplePoll = new PostDisplay(new Post({
        // id?: string | undefined;
        postType: PostTypes.POLL,
        createdDateUtc: new Date(),
        lastUpdatedDateUtc: new Date(),
        subject: 'What is your favorite flavor',
        categoryName: CategoryTypes.FOOD_DRINK,
        startDateUtc: new Date(),
        endDateUtc: new Date(),
        author: new NeatBoutiqueEntity({
          // id?: string | undefined;
          // role?: string | undefined;
          name: "Jim's Ice Cream",
          // avatarSourceURL?: string | undefined;
          // profilePath?: string | undefined;
        }),
        selections: [
          new Selection({ freeFormAnswer: 'Chocolate', votes: new Array(113).fill(new SelectionVote({voter: (new NeatBoutiqueEntity({name: ''})) })) }),
          new Selection({ freeFormAnswer: 'Vanilla', votes: new Array(101).fill(new SelectionVote({voter: (new NeatBoutiqueEntity({name: ''})) })) }),
          new Selection({ freeFormAnswer: 'Strawberry', votes: new Array(89).fill(new SelectionVote({voter: (new NeatBoutiqueEntity({name: ''})) })) }),
        ],
        comments: (new Array(1).fill(null)).map((el, i) => {
          // create some demo comments        
          const demoUsers = ['Eric', 'John', 'Sally', 'Mary'];
          const userName = demoUsers[this._utilService.randomRange(0, demoUsers.length-1)];
          const commentText = [
            'OMG! Your chocolate ice-cream is my favorite on earth!!! That will always be my vote!',
            "I'm usually a strawberry man myself, but your vanilla is A*M*A*Z*I*N*G!"
          ]
          const likeCount = (new Array(this._utilService.randomRange(0, 10)).fill(null).map((x, i) => new NeatBoutiqueEntity({ id: i+'' })));
          return new CommentDisplay(new Comment({
              id: 'demo-comment',
              createdDateUtc: new Date(),
              lastUpdatedDateUtc: new Date(),
              body: commentText[i],
              author: new NeatBoutiqueEntity({
                id: 'demo-user',
                name: userName,
              }),
              likers: likeCount,
            }));
          }),
      }));
    // });
  }

  
}





