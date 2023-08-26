import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsumerPostDisplay } from 'src/app/models/consumer-post-display';
import { CommunityTypes, SubscriptionPlanTypes } from 'src/app/models/constants';
import { VendorPostDisplay } from 'src/app/models/vendor-post-display';
import { CommunityDisplay, CommunityService } from 'src/app/services/community.service';
import { NeatBoutiqueEntity, PollAnswer, Comment, VendorPost, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { UtilService } from 'src/app/services/util.service';
import { CommentDisplay } from 'src/app/models/comment-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorDisplay } from 'src/app/models/vendor-display';

@Component({
  selector: 'app-poll-ad-placeholder',
  templateUrl: './poll-ad-placeholder.component.html',
  styleUrls: ['./poll-ad-placeholder.component.scss'],
})
export class PollAdPlaceholderComponent implements OnInit {
  @Input() vendor: VendorDisplay;
  public examplePoll: VendorPostDisplay;
  private _subscriptionPlanTypes = SubscriptionPlanTypes;
  public get subscriptionPlanTypes() {
    return this._subscriptionPlanTypes;
  }
  public set subscriptionPlanTypes(value) {
    this._subscriptionPlanTypes = value;
  }


  constructor(private _utilService: UtilService, private _communityService: CommunityService,
    private _accountsService: AccountsService, private _router: Router) {

     
  }
  ngOnInit() {
    this._loadExamplePoll();    
  }

  goToPollAds() {
    if(this.vendor?.vendorSubscriptionPlan === SubscriptionPlanTypes.VENDOR_STANDARD) {
      this.goToPricing();
    } else {
      this._router.navigateByUrl('/vendor-settings/poll-ads', { state: this.vendor });
    }
  }

  goToPricing() {
    this._router.navigateByUrl('/pricing', { state: this.vendor });
  }

  private _loadExamplePoll() {
    // TODO: update with real service when it's ready
    // this._communityService.loadPostsByCommunityNames(CommunityTypes.BOUTIQUES_BEAUTY);
    // this._communityService.communityDisplaySubject.subscribe((display: CommunityDisplay) => {  

      // a post with 5+ answers
      this.examplePoll = new VendorPostDisplay(new VendorPost({
        // id?: string | undefined;
        createdDateUtc: new Date(),
        lastUpdatedDateUtc: new Date(),
        question: 'What is your favorite flavor',
        communityName: CommunityTypes.FOOD_DRINK,
        campaignStartDateUtc: new Date(),
        campaignEndDateUtc: new Date(),
        author: new NeatBoutiqueEntity({
          // id?: string | undefined;
          // role?: string | undefined;
          name: "Jim's Ice Cream",
          // avatarSourceURL?: string | undefined;
          // profilePath?: string | undefined;
        }),
        answers: [
          new PollAnswer({ answerText: 'Chocolate', voters: (new Array(113).fill(new NeatBoutiqueEntity({name: ''}))) }),
          new PollAnswer({ answerText: 'Vanilla', voters: (new Array(101).fill(new NeatBoutiqueEntity({name: ''}))) }),
          new PollAnswer({ answerText: 'Strawberry', voters: (new Array(89).fill(new NeatBoutiqueEntity({name: ''}))) }),
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





