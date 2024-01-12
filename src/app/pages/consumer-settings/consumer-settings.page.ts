import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { PostDisplay } from 'src/app/models/post-display';
import { ConsumerProfileActivityDisplay } from 'src/app/models/consumer-profile-activity-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { AnswersService } from 'src/app/services/answers.service';
import { CommunityService } from 'src/app/services/community.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-consumer-settings',
  templateUrl: './consumer-settings.page.html',
  styleUrls: ['./consumer-settings.page.scss'],
})
export class ConsumerSettingsPage implements OnInit {
  currentUser: CurrentUserDisplay;
  selectedActivity: string = 'recent-questions';
  recentActivity: ConsumerProfileActivityDisplay = new ConsumerProfileActivityDisplay();
  public maxConsumerDescriptionChars: number;
  public editDescription: boolean = false;
  public descriptionForm: UntypedFormGroup;
  public editUsername: boolean;
  public newUsername: string;

  constructor(private _accountsService: AccountsService, private _modalService: ModalService, private _communityService: CommunityService,
      private _consumerService: ConsumerService, private _answersService: AnswersService, private _authService: AuthService) { 
    
      this.maxConsumerDescriptionChars = 500;
      
      this.descriptionForm = new UntypedFormGroup({
        description: new UntypedFormControl('', [ Validators.maxLength(this.maxConsumerDescriptionChars)]),
      });
  }

  ngOnInit() {
    this._accountsService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
      if(currentUser) {
         this.currentUser = currentUser;
         this.newUsername = currentUser.consumer.name;
        
        if(this.currentUser.consumer.id) {
          this._consumerService.getRecentActivitesByConsumerId(this.currentUser.consumer.id, 0, 15).then((response) => {
            if(response) {
              this.currentUser.consumer.questionsAskedCount = response.questionsAskedCount;
              this.currentUser.consumer.questionsAnsweredCount = response.questionsAnsweredCount;
              this.currentUser.consumer.reviewsCount = response.reviewsCount;
              this.recentActivity = response;
              this._answersService.refreshCurrentUserVotesOnPosts(this.recentActivity.recentQuestions);
              this._answersService.refreshCurrentUserVotesOnPosts(this.recentActivity.recentAnswers);
            }
          });
        }
        

        this._answersService.questionAnsweredOnPostSubject.subscribe((post: PostDisplay) => {
          if(post) {
            var updatedQuestions = this._communityService.updateConsumerPostInPosts(post, this.recentActivity.recentQuestions);
            this._answersService.refreshCurrentUserVotesOnPosts(updatedQuestions);

            var updatedAnswers = this._communityService.updateConsumerPostInPosts(post, this.recentActivity.recentAnswers);
            this._answersService.refreshCurrentUserVotesOnPosts(updatedAnswers);
          }
        });
      }
    })
  }

 

  public async saveEditDescription() {
    this.editDescription = !this.editDescription;
    this.currentUser.consumer = await this._consumerService.updateConsumerDescription(this.descriptionForm.value.description)
  }

  public async saveEditUsername() {
    this._authService.changeUsername(this.newUsername);
    this.editUsername = !this.editUsername;
  }

  async showUploadPhotoModal() {
    const { data: { openPictureModal, newBorderColor } } = await this._modalService.displayChangeAvatarModal(this.currentUser.consumer);

    if(newBorderColor) {
      this._consumerService.updateBorderColor(newBorderColor);
    }

    if(openPictureModal) {
      const { data: { imgBase64Path } } = await this._modalService.displayPhotoUploadModal(true);
    
      if(imgBase64Path) {
        this.currentUser.consumer.avatarSourceURL = imgBase64Path;
        this.currentUser.consumer = await this._consumerService.uploadConsumerProfileImage(imgBase64Path);
        this._authService.changePhotoURL(this.currentUser.consumer.avatarSourceURL);
      }  
    }  
  }

  toggleEditDescription() {
    this.editDescription = !this.editDescription;
  }

  toggleEditUsername() {
    this.newUsername = this.currentUser.consumer.name;
    this.editUsername = !this.editUsername;
  }

  
}
