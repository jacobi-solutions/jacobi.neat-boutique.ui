import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AnswerDisplay } from 'src/app/models/answer-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { SelectionVote, GooglePlacesEntity, NeatBoutiqueEntity } from 'src/app/services/neat-boutique-api.service';
import { Router } from '@angular/router';
import { CommunityService } from 'src/app/services/community.service';
import { AnswersService } from 'src/app/services/answers.service';
import { PopoverController } from '@ionic/angular';
import { SelectionVoteRankingColorsMap, SelectionVoteRankingTypes, PostTypes } from 'src/app/models/constants';

@Component({
  selector: 'app-answer-item',
  templateUrl: './answer-item.component.html',
  styleUrls: ['./answer-item.component.scss'],
})
export class AnswerItemComponent implements OnInit {
  @ViewChild('chartBar', { read: ElementRef }) chartBarElement: ElementRef;
  // @ViewChild('chartBarMobile', { read: ElementRef }) chartBarMobileElement: ElementRef;
  @Input() expanded: boolean = false;
  @Input() chartColor: string;
  @Input() answer: AnswerDisplay;
  @Input() answers: AnswerDisplay[];
  @Input() chartBar: number = 100;
  @Input() altStyle: string;
  @Input() isDemo: boolean = false;

  public endorsedVendor: string;
  public votedIcon: string = 'star-outline';
  public currentUser: CurrentUserDisplay;
  borderColor: string;
  currentUserVote: SelectionVote;
  answerVoteRankingTypes = SelectionVoteRankingTypes;
  postTypes = PostTypes;
  
  constructor(private _communityService: CommunityService, private _customersService: AccountsService, private _modalService: ModalService,
    private _router: Router, private _answersService: AnswersService, private _popoverController: PopoverController) {}

  ngOnInit() {
    this._customersService.currentUserSubject.subscribe((user) => {
      this.currentUser = user;
      this.currentUserVote = this.answer.votes.find(x => this.currentUser?.hasId(x.voter.id));
      if(this.answer.postType === PostTypes.QUESTION) {
        if(this.currentUserVote) {
          this.borderColor = SelectionVoteRankingColorsMap.get(this.currentUserVote.voteRanking);
        } else if(this.answer.entity.isGooglePlaceEntity) {
          this.borderColor = '#013e43';
        } else {
          this.borderColor = this.answer.vendor.borderColor;
        }
      } 
      
    });   
  }

  

  ngAfterViewInit() {
    this._setBarStyles();
    
  }

  ngOnChanges() {
    this._setBarStyles();
  }

  async addVote() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }
    
    if(!this.isDemo) {
      const answerRanking = await this._modalService.displayChooseAnswerRankingModal(this.answer, this.answers);
      
      if(this.answer.postType === PostTypes.QUESTION) {
        if(answerRanking.choice === SelectionVoteRankingTypes.REMOVE) {
          await this._answersService.removeAnswerVoteFromAnswer(answerRanking.answerToRemove);
        } else {
          if(this.answer.entity.isGooglePlaceEntity) {
            await this._answersService.answerQuestionWithGoolgePlace(new GooglePlacesEntity(this.answer.googlePlace), this.answer.postId, answerRanking.choice);    
          } else {
            await this._answersService.answerQuestionWithVendor(new NeatBoutiqueEntity(this.answer.vendor), this.answer.postId, answerRanking.choice);
          }
        }
      } else if(this.answer.postType === PostTypes.POLL) {
        if(answerRanking.choice === SelectionVoteRankingTypes.REMOVE) {
          await this._answersService.removeVoteFromPollAnswer(answerRanking.answerToRemove);
        } else { 
          await this._answersService.addVoteToPollAnswer(this.answer.id, answerRanking.choice);
        }
          
      }
      
    }
  }

  async removeVote() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }
    
    if(!this.isDemo) {
      var answerVote = this.answer.votes.find(x => this.currentUser.hasId(x.voter.id));
      if(answerVote){
        await this._answersService.removeAnswerVoteFromAnswer(answerVote);
      }
      
    }
  }

  goToVendor() {
    this._router.navigateByUrl('/vendor-profile/' + this.answer?.vendor.profilePath);
  }


  private _setBarStyles() {
    if(this.chartBarElement && this.chartColor) {      
      this.chartBarElement.nativeElement.style.background = this.chartColor;
      this.chartBarElement.nativeElement.style.width = this.chartBar + '%';
      // mobile bar
      // this.chartBarMobileElement.nativeElement.style.background = this.chartColor;
      // this.chartBarMobileElement.nativeElement.style.width = this.chartBar + '%';
    }
  }
}
