import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerPostDisplay } from 'src/app/models/consumer-post-display';
import { ConsumerProfileActivityDisplay } from 'src/app/models/consumer-profile-activity-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { ReviewDisplay } from 'src/app/models/review-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { AnswersService } from 'src/app/services/answers.service';
import { CommunityService } from 'src/app/services/community.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ConsumerProfile } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-consumer-profile',
  templateUrl: './consumer-profile.page.html',
  styleUrls: ['./consumer-profile.page.scss'],
})
export class ConsumerProfilePage implements OnInit {
  currentUser: CurrentUserDisplay;
  consumerProfile: ConsumerProfile;
  selectedActivity: string = 'recent-questions';
  recentActivity: ConsumerProfileActivityDisplay = new ConsumerProfileActivityDisplay();

  constructor(private _accountsService: AccountsService, private _activatedRoute: ActivatedRoute, private _communityService: CommunityService,
      private _consumerService: ConsumerService, private _router: Router, private _answersService: AnswersService) { 
    
  }

  ngOnInit() {
    const routeParams = this._activatedRoute.snapshot.paramMap;    
    const consumerPath = routeParams.get('consumerPath');   

    let nav = this._router.getCurrentNavigation();

    if (nav.extras && nav.extras.state && nav.extras.state.consumer) {
      this.consumerProfile = new ConsumerProfile(nav.extras.state.consumer);
    }
    // var avatarSourceUrl = routeParams.get('avatarSourceUrl');  
    // var name = routeParams.get('name');  
    // if(name && avatarSourceUrl) {
    //   this.consumerProfile = new ConsumerProfile({ name: name, avatarSourceURL: avatarSourceUrl });
    // }
    
    this._consumerService.getConsumerProfileByPath(consumerPath).then(consumer => {      
      this.consumerProfile = consumer;

      this._consumerService.getRecentActivitesByConsumerId(consumer.id, 0, 15).then((response) => {
        this.consumerProfile.questionsAskedCount = response.questionsAskedCount;
        this.consumerProfile.questionsAnsweredCount = response.questionsAnsweredCount;
        this.consumerProfile.reviewsCount = response.reviewsCount;
        if(response) {
          this.recentActivity = response;
          this._answersService.refreshCurrentUserVotesOnPosts(this.recentActivity.recentQuestions);
          this._answersService.refreshCurrentUserVotesOnPosts(this.recentActivity.recentAnswers);
        }
      });

      this._answersService.questionAnsweredOnPostSubject.subscribe((post: ConsumerPostDisplay) => {
        if(post) {
          var updatedQuestions = this._communityService.updateConsumerPostInPosts(post, this.recentActivity.recentQuestions);
          this._answersService.refreshCurrentUserVotesOnPosts(updatedQuestions);

          var updatedAnswers = this._communityService.updateConsumerPostInPosts(post, this.recentActivity.recentAnswers);
          this._answersService.refreshCurrentUserVotesOnPosts(updatedAnswers);
        }
      });
    })
  }

}
