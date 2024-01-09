import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AnswerDisplay } from 'src/app/models/answer-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { CommunityService } from 'src/app/services/community.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { Answer, GooglePlacesEntity, NeatBoutiqueEntity, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { THEME } from 'src/theme/theme-constants';
import { debounceTime } from 'rxjs/operators';
import { EntityDisplay } from 'src/app/models/entity-display';
import { PostType } from 'typings/custom-types';
import { UtilService } from 'src/app/services/util.service';
import { AnswersService } from 'src/app/services/answers.service';
import { AnswerVoteRankingTypes } from 'src/app/models/constants';


@Component({
  selector: 'app-answer-list',
  templateUrl: './answer-list.component.html',
  styleUrls: ['./answer-list.component.scss'],
})
export class AnswerListComponent implements OnInit {
  @Input() postType: string = PostType.COMMUNITY_QUESTION;
  @Input() postId: string;
  @Input() chartShowAll: boolean = false;
  @Input() communityName: string;
  @Input() answers: AnswerDisplay[] = [];
  @Input() altAnswerStyle: string;
  @Input() isDemo: boolean = false;
  @Input() defaultNumberOfAnswersToShow: number = 5;

  public postTypes = PostType;
  public answersChanged: boolean = true;
  public minimalAnswers: AnswerDisplay[] = [];
  
  public colors: string[] = THEME.colors.list;
  public viewRangeText: string = 'View all';
  public currentUser: CurrentUserDisplay = null;
  public submitIcon: string = 'paper-plane-outline';
  public selectedVendor: EntityDisplay = null;
  public vendorResults: EntityDisplay[];
  //public sortByVoteTotals: any;
  public normalize: any;
  public answerForm = new UntypedFormGroup({
    newAnswer: new UntypedFormControl('', [Validators.minLength(3)]),
  });

  private _votes: number[];
  private _searchVendor: { minChars: number, lastSearchText: string, results: EntityDisplay[] };
  
  constructor(
    private _communityService: CommunityService,
    private _accountsService: AccountsService,
    private _modalService: ModalService,
    private _util: UtilService,
    private _answersService: AnswersService) {
    this._searchVendor = { minChars: 3, lastSearchText: '', results: [] };    
  }

  ngOnInit() {
    this._accountsService.currentUserSubject.subscribe((user) => {
        this.currentUser = user;
    });

    this.answerForm.controls.newAnswer.valueChanges
      .pipe(debounceTime(500))
      .subscribe((searchText) => this.searchVendors(searchText));    

    //this.sortByVoteTotals = this._util.sortByVoteTotals;  
    this.normalize = this._util.normalizedAnswersForChartMinMax;
  }

  ngOnChanges() {
    if(this.answers) {
      if(this.chartShowAll) {
        this.minimalAnswers = this.answers;
      } else {
        this.minimalAnswers = this.answers.slice(0, this.defaultNumberOfAnswersToShow);
      }
      
    }
  }
    
  toggleShowAll() {
    this.chartShowAll = !this.chartShowAll;

    if(this.chartShowAll) {
      this.viewRangeText = 'View less';
      this.minimalAnswers = this.answers;
    } else {
      this.viewRangeText = 'View all';
      this.minimalAnswers = this.answers.slice(0, this.defaultNumberOfAnswersToShow);
    }
  }

  async addNewAnswer() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }

    if(this.selectedVendor !== null) {
      var newAnswer = new AnswerDisplay(new Answer());
      newAnswer.entity = this.selectedVendor;
      const answerRanking = await this._modalService.displayChooseAnswerRankingModal(newAnswer, this.answers as AnswerDisplay[]);      
      
      if(!this.isDemo) {
        
        if(this.selectedVendor.isGooglePlaceEntity) {
          this._answersService.answerQuestionWithGoolgePlace(new GooglePlacesEntity(this.selectedVendor), this.postId, answerRanking.choice);    
        } else {
          this._answersService.answerQuestionWithVendor(new NeatBoutiqueEntity(this.selectedVendor), this.postId, answerRanking.choice);
        }
        
      }
      
      this.selectedVendor = null;
      this.answerForm.patchValue({ newAnswer: null });
      this.vendorResults = [];
      this._searchVendor.results = []; 
    }
  }


  async searchVendors(rawSearchText: string) {
    
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    } 
      //else if(!rawSearchText) {
      // this.vendorResults = [];
      // this._searchVendor.results = [];
      // return;
    //}

    const searchText = rawSearchText?.trim();
    if(searchText !== this.selectedVendor?.name) {
      this.selectedVendor = null;
    }

    if(searchText && (searchText?.length >= this._searchVendor?.minChars) && (searchText !== this._searchVendor?.lastSearchText)) {
      this._searchVendor.lastSearchText = searchText;
      this._searchVendor.results = await this._communityService.autocompleteSearchForAnswer({
        communityName: this.communityName,
        searchString: this._searchVendor.lastSearchText
      });
      this.vendorResults = this._searchVendor.results;      
    } else {
      this.vendorResults = [];
      this._searchVendor.lastSearchText = '';
    }    
  }

  selectedVendorNull() {
    this.selectedVendor = null;
  }

  selectVendorFromList(vendor: EntityDisplay) {
    this.selectedVendor = vendor;
  }
}

