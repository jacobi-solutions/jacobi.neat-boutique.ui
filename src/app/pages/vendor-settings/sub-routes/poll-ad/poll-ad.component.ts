import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { CommentDisplay } from 'src/app/models/comment-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { PostTypes, SubscriptionPlanTypes, UserRoleTypes } from 'src/app/models/constants';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { NeatBoutiqueEntity, Comment, Answer, AnswerVote, Post } from 'src/app/services/neat-boutique-api.service';
import { UtilService } from 'src/app/services/util.service';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';
import { Router } from '@angular/router';
import { AnswerDisplay } from 'src/app/models/answer-display';
import { PostDisplay } from 'src/app/models/post-display';

@Component({
  selector: 'app-poll-ad',
  templateUrl: './poll-ad.component.html',
  styleUrls: ['./poll-ad.component.scss'],
})
export class PollAdComponent implements OnInit {
  vendor: VendorDisplay;

  @ViewChild('content', { read: ElementRef }) content: IonContent;
  
  public pollLivePreview: PostDisplay;
  public pollAdToSubmit: UntypedFormGroup;
  public clearForm: boolean;

  public hasPremiumSubscription: boolean;
  public pollIsCreated: boolean;

  constructor(private _utilService: UtilService, private _accountsService: AccountsService,
    private _vendorSettingsService: VendorSettingsService, private _router: Router) {
    this.vendor = (this._router.getCurrentNavigation().extras.state) as VendorDisplay;  

    // create temp live preview poll post
    this.pollLivePreview = new PostDisplay(new Post({
      id: 'demo-poll',
      postType: PostTypes.POLL,
      createdDateUtc: new Date(),
      author: this.vendor,
      lastUpdatedDateUtc: new Date(),
      comments: (new Array(2).fill(null)).map(el => {
        // create some demo comments        
        const demoUsers = ['Jim', 'Eric', 'John', 'Sally', 'Mary'];
        const userName = demoUsers[this._utilService.randomRange(0, demoUsers.length-1)];
        const likeCount = (new Array(this._utilService.randomRange(0, 10)).fill(null).map((x, i) => new NeatBoutiqueEntity({ id: i+'' })));
        return new CommentDisplay(new Comment({
            id: 'demo-comment',
            createdDateUtc: new Date(),
            lastUpdatedDateUtc: new Date(),
            body: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia voluptate quidem at! Mollitia nostrum voluptate aliquam sapiente alias molestias quam labore accusantium nemo hic atque rerum praesentium odit, libero magnam quisquam ducimus! Minima sequi aperiam eaque nobis exercitationem rerum unde veritatis commodi suscipit fugit. In quaerat dolorem quia corporis obcaecati.',
            author: new NeatBoutiqueEntity({
              id: 'demo-user',
              name: userName,
            }),
            likers: likeCount,
          }));
        }),
    }));
    
    

    this._vendorSettingsService.newPollAdSubject.subscribe(pollFrom => {
      this.pollAdToSubmit = pollFrom;      
    });
  }

  ngOnInit() { 
    this.hasPremiumSubscription = this.vendor.vendorSubscriptionPlan !== SubscriptionPlanTypes.VENDOR_NO_SUBSCRIPTION;  
    this.pollLivePreview.author = new NeatBoutiqueEntity({
      profilePath: this.vendor.profilePath, 
      name: this.vendor.name,
      role: UserRoleTypes.VENDOR
    });
  }

  updateLivePreview(pollForm) {    
    if(pollForm) {
      const {
        community,
        pollQuestion,
        pollAnswer1,
        pollAnswer2,
        pollAnswer3,
        pollAnswer4,
        pollAnswer5,
      } = pollForm;
  
      this.pollLivePreview.communityName = community;
      this.pollLivePreview.question = pollQuestion;
      this.pollLivePreview.answers = [pollAnswer1,pollAnswer2,pollAnswer3,pollAnswer4,pollAnswer5].map((answer, i) => {
        let voterCount: number;
        switch(i) {
          case 0:
            voterCount = 10;
            break;
          case 1:
            voterCount = 0;
            break;
          default:
            voterCount = this._utilService.randomRange(0, 9);
        }

        //const voters = (voterCount > 0) ? (new Array(voterCount).fill(null)).map(x => new NeatBoutiqueEntity({id: 'demo'})) : [];
        const votes = (voterCount > 0) ? (new Array(voterCount).fill(null)).map(x => new AnswerVote({voter: new NeatBoutiqueEntity({id: 'demo'})}) ) : [];

        if(answer) {
          return new AnswerDisplay(new Answer({
            freeFormAnswer: answer,
            votes: votes,
          }), PostTypes.POLL);
        }
        return null;
      }).filter(a => a);      
    }
  }

  async submitPoll() {
    if(!this.vendor || !this.pollAdToSubmit || this.pollAdToSubmit?.invalid || !this.pollAdToSubmit?.value) {
      return null;
    }

    if (this.hasPremiumSubscription) {
      const pollAnswers = Object.keys(this.pollAdToSubmit?.value).map(fieldName => {
        if(fieldName.toLowerCase().includes('answer') && this.pollAdToSubmit.value[fieldName]) {
          return new Answer({ freeFormAnswer: this.pollAdToSubmit?.value[fieldName], votes: [] });
        }
        return null;
      }).filter(x => x);    
    
      

      const vendorPost = new Post({
        postType: PostTypes.POLL,
        communityName: this.pollAdToSubmit.value.community,
        question: this.pollAdToSubmit.value.pollQuestion,
        answers: pollAnswers,
        author: new NeatBoutiqueEntity({
          avatarSourceURL: this.vendor.avatarSourceURL,
          id: this.vendor.id,
          name: this.vendor.name,
          role: UserRoleTypes.VENDOR
        })
      });
      
      const newPost = await this._vendorSettingsService.createVendorPost(vendorPost);
      if(newPost?.id) {
        this.clearForm = true;
      }
      this.pollIsCreated = true;
    } else {
      this._router.navigateByUrl('/pricing');
    }
  }
  
}
