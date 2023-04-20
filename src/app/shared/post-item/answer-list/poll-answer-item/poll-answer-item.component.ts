import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { PollAnswerDisplay } from 'src/app/models/poll-answer-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { CommunityService } from 'src/app/services/community.service';
import { ModalService } from 'src/app/services/modal.service';
import { NeatBoutiqueEntity } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-poll-answer-item',
  templateUrl: './poll-answer-item.component.html',
  styleUrls: ['./poll-answer-item.component.scss'],
})
export class PollAnswerItemComponent implements OnInit {
  @ViewChild('chartBar', { read: ElementRef }) chartBarElement: ElementRef;
  @ViewChild('answerTextWeb', { read: ElementRef }) answerTextWeb: ElementRef;
  @ViewChild('answerItemWeb', { read: ElementRef }) answerItemWeb: ElementRef;

  @Input() expanded: boolean = false;
  @Input() chartColor: string;
  @Input() answer: PollAnswerDisplay;
  @Input() chartBar: number = 100;
  @Input() altStyle: string;
  @Input() reportStatusToParentCallback: Function;
  @Input() isDemo: boolean = false;

  public endorsedVendor: string;
  public votedIcon: string = 'star-outline';
  public currentUser: CurrentUserDisplay;
  
  constructor(
    private _communityService: CommunityService,
    private _customersService: AccountsService,
    private _modalService: ModalService,
  ) {}

  ngOnInit() {
    this._customersService.currentUserSubject.subscribe((user) => {
      this.currentUser = user;
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
      return null;
    }

    if(!this.isDemo) {
      await this._communityService.addVoteToPollAnswer(this.answer);
    }
    if(this.expanded) {
      this._setBarStyles();
    }
  }
  async removeVote() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return null;
    }
    if(!this.isDemo) {
      await this._communityService.removeVoteFromPollAnswer(this.answer);
    }
    if(this.expanded) {
      this._setBarStyles();
    }
  }

  private _setBarStyles() {
    if(this.chartBarElement && this.chartColor) {      
      this.chartBarElement.nativeElement.style.background = this.chartColor;
      this.chartBarElement.nativeElement.style.width = this.chartBar + '%';
    }
  }
}
