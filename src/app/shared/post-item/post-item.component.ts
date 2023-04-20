import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConsumerPostDisplay } from 'src/app/models/consumer-post-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { CommunityService } from 'src/app/services/community.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { THEME } from 'src/theme/theme-constants';
import { AnswerDisplay } from 'src/app/models/answer-display';
import { Answer, NeatBoutiqueEntity } from 'src/app/services/neat-boutique-api.service';
import { VendorPostDisplay } from 'src/app/models/vendor-post-display';
import { PostType } from 'typings/custom-types';
import { Router } from '@angular/router';
import { PollAnswerDisplay } from 'src/app/models/poll-answer-display';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {
  @Input() post: (ConsumerPostDisplay | VendorPostDisplay);
  // @Input() expandTopVoted: boolean = null;
  @Input() expandComments: boolean;
  @Input() altAnswerStyle: string;
  @Input() isDemo: boolean = false;

  public postTypes = PostType;
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
    return this.post.author.name + ((this.post.postType === PostType.POLL) ? ' (Sponsored)' : '');
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
    if(this.isDemo && this.post && (this.post.postType === PostType.POLL)) {
      this._router.navigateByUrl('/vendor-profile/' + this.currentUser.vendor.profilePath);
    } else if(this.post && (this.post.postType === PostType.POLL)) {
      this._router.navigateByUrl('/vendor-profile/' + this.post?.author.profilePath);
    }
  }
}
