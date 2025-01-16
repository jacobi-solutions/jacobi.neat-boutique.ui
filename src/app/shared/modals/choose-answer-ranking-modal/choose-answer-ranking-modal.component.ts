import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { Selection, SelectionVote, ConsumerProfile, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { Router } from '@angular/router';
import { AnswerDisplay } from 'src/app/models/answer-display';
import { PostTypes } from 'src/app/constants/post-types';
import { SelectionVoteRankingTypes } from 'src/app/constants/selection-vote-ranking-types';

@Component({
  selector: 'app-choose-answer-ranking-modal',
  templateUrl: './choose-answer-ranking-modal.component.html',
  styleUrls: ['./choose-answer-ranking-modal.component.scss'],
})
export class ChooseAnswerRankingModalComponent implements OnInit {
  @Input() noticeInnerHTML: Function;
  @Input() answer: AnswerDisplay;
  @Input() answers: AnswerDisplay[];

  public consumer: ConsumerProfile;
  public vendor: VendorProfile;
  private _currentUser: CurrentUserDisplay = null;
  answerVoteRankingTypes = SelectionVoteRankingTypes;
  currentUserFirstChoiceAnswer: AnswerDisplay;
  currentUserSecondChoiceAnswer: AnswerDisplay;
  currentUserThirdChoiceAnswer: AnswerDisplay;
  showRemoveAnswer: boolean;
  showCancel: boolean;
  answerVoteToRemove: SelectionVote;
  postTypes = PostTypes;

  constructor(private _modalController: ModalController, private _router: Router, private _accountsService: AccountsService) {

  }
    

  ngOnInit() {
    this._accountsService.currentUserSubject.subscribe((user) => {
      this._currentUser = user;
      
      this.answers.forEach(answer => {
        var currentUserVote = answer.votes.find(x => this._currentUser.hasId(x.voter.id));
        if(currentUserVote?.voteRanking === this.answerVoteRankingTypes.FIRST) {
          this.currentUserFirstChoiceAnswer = answer;
        }
        if(currentUserVote?.voteRanking === this.answerVoteRankingTypes.SECOND) {
          this.currentUserSecondChoiceAnswer = answer;
        }
        if(currentUserVote?.voteRanking === this.answerVoteRankingTypes.THIRD) {
          this.currentUserThirdChoiceAnswer = answer;
        }
      })
      
      if(this.answer.id && (this.answer.id === this.currentUserFirstChoiceAnswer?.id ||
        this.answer.id === this.currentUserSecondChoiceAnswer?.id ||
        this.answer.id === this.currentUserThirdChoiceAnswer?.id)) {
          this.showRemoveAnswer = true;
          this.answerVoteToRemove = this.answer.votes.find(x => this._currentUser.hasId(x.voter.id));
      } else {
        this.showCancel = true;
      }
  });
    
  }

  ionViewDidEnter() {
    // dynamically set modal height based on content height
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
    // const modalWrapper = document?.querySelector('.modal-wrapper');  
    // const modal = document?.getElementsByTagName('app-choose-answer-ranking-modal')[0];
    // modal?.setAttribute('style', `height: ${modalCardHeight}px`);

  }

  onClose() {
    this._modalController.dismiss({
      canceled: true,
    });
  }
  goToVendor() {
    this.onClose();
    this._router.navigateByUrl('/vendor-profile/' + this.answer?.vendor.profilePath);
  }

  chooseRanking(rankingChoice: string) {
    this._modalController.dismiss({
      canceled: false,
      choice: rankingChoice,
    });
  }

  removeVote() {
    this._modalController.dismiss({
      canceled: false,
      choice: SelectionVoteRankingTypes.REMOVE,
      answerToRemove: this.answerVoteToRemove
    });
  }

}
