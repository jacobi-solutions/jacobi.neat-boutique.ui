import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostDisplay } from 'src/app/models/post-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { CommunityService } from 'src/app/services/community.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { THEME } from 'src/theme/theme-constants';
import { AnswerDisplay } from 'src/app/models/answer-display';
import { Answer, NeatBoutiqueEntity } from 'src/app/services/neat-boutique-api.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { PostTypes } from 'src/app/models/constants';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  @Input() post: (PostDisplay);
  // @Input() expandTopVoted: boolean = null;
  @Input() expandComments: boolean;
  @Input() altAnswerStyle: string;
  @Input() isDemo: boolean = false;

  public postTypes = PostTypes;
  public currentUser: CurrentUserDisplay;
  // public iconShowChart: string;
  public iconShowComments: string;
  public colors: string[] = THEME.colors.list;
  public isPoll: boolean;
  public sortByPointTotals: any;
  public hasAnswered: boolean;

  constructor(
    private _customersService: AccountsService,
    private _util: UtilService,
    private _communityService: CommunityService,
    private _router: Router) { }

  ngOnInit() {    
    this._customersService.currentUserSubject.subscribe((user) => {
        this.currentUser = user;  
    });

    // set defaults base on passed values
    // if(this.expandTopVoted === null) {
    //   this.expandTopVoted = this.post?.expanded || false;
    // }

    this.sortByPointTotals = this._util.sortByPointTotals;    

  }

  ngOnChanges() {
    if(this.post?.answers) {
      this.post.answers = this._util.normalizedAnswersForChartMinMax(this.post?.answers);
    }

    // this.iconShowChart = this.expandTopVoted ? 'eye-outline' : 'eye-off-outline';
    this.iconShowComments = this.expandComments ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
  }

  getDisplayName() {
    return this.post.author.name + ((this.post.postType === PostTypes.POLL) ? ' (Sponsored)' : '');
  }

  goToConsumerProfilePage(author: NeatBoutiqueEntity) {
    let route = `/profile/${author.profilePath}`;
    this._router.navigate([route], { state: { consumerProfileEntity: author } });
  }


  // toggleTopVotedChart() {
  //   // this.expandTopVoted = !this.expandTopVoted;
  //   // this.iconShowChart = this.expandTopVoted ? 'eye-outline' : 'eye-off-outline';
  // }

  toggleComments() {
    this.expandComments = !this.expandComments;
    this.iconShowComments = this.expandComments ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
  }

  // for vendor polls
  goToVendor() {
    if(this.post && (this.post.postType === PostTypes.POLL)) {
      this._router.navigateByUrl('/vendor-profile/' + this.post?.author.profilePath);
    }
  }
}
