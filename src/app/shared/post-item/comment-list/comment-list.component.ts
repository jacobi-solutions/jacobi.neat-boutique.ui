import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CommentDisplay } from 'src/app/models/comment-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { UserRoleTypes } from 'src/app/constants/user-role-types';
import { CategoryService } from 'src/app/services/category.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { ModalService } from 'src/app/services/modal.service';
import { Comment, ConsumerProfile, NeatBoutiqueEntity, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { UtilService } from 'src/app/services/util.service';
import { PostDisplay } from 'src/app/models/post-display';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
})
export class CommentListComponent implements OnInit {
  @ViewChild('newComment', { read: ElementRef }) newComment: ElementRef;
  @Input() post: PostDisplay;
  @Input() isDemo: boolean = false;
    public currentUser: CurrentUserDisplay = null;
  public minCommentToShow: number = 3;
  public shownComments: CommentDisplay[] = [];
  public showAllComments: boolean = false;
  public viewRangeText: string = 'View more';
  public submitIcon: string = 'paper-plane-outline';
  public commentForm = new UntypedFormGroup({
    newComment: new UntypedFormControl('', [Validators.minLength(1)]),
  });

  private _minCommentCount = 3;
  private _oneTimeSettings = {
    nativeTextareaStyle: false,
  };
  
  
  constructor(private _categoryService: CategoryService, private _customersService: AccountsService, private _util: UtilService, private _modalService: ModalService) {
    this._customersService.currentUserSubject.subscribe(user => {
        this.currentUser = user;        
    });
  }


  ngOnInit() {   
    this.post.comments = this.post.comments.filter(x => !x.isDeleted);
    this.shownComments = this.post.comments.sort(this._util.sortByCreatedDateUtc).slice(0, this._minCommentCount);
  }


  ngAfterViewChecked() {
    if(this._oneTimeSettings.nativeTextareaStyle) {
      const nativeTextArea = [...this.newComment.nativeElement.children]
      .filter((child) => [...child.classList]
      .some(className => className === 'textarea-wrapper'))[0]?.childNodes[0];

      if(nativeTextArea) {
        nativeTextArea.style.maxWidth = '90%';
        this._oneTimeSettings.nativeTextareaStyle = true;
      }
    }

    if(this.post.comments?.length <= this._minCommentCount) {
      this.showAllComments = false;
      this.viewRangeText = 'View more';
    }
  }


  toggleShowAll() {
    this.showAllComments = !this.showAllComments;
    if(!this.showAllComments) {
      this.viewRangeText = 'View more';
      this.shownComments = this.post.comments.slice(0, this._minCommentCount);
    } else {
      this.shownComments = this.post.comments;
      this.viewRangeText = 'View less';
    }
  }


  updateCommentStatusFromChildCallback() {
    const self = this;
    return () => {
      self.post.comments = self.post.comments.filter(x => !x.isDeleted).sort(self._util.sortByCreatedDateUtc);
      if(!self.showAllComments) {
        self.viewRangeText = 'View more';
        self.shownComments = self.post.comments.slice(0, self._minCommentCount);
      } else {
        self.shownComments = self.post.comments;
        self.viewRangeText = 'View less';
      }
    }
  }


  onNewCommentChange() {
    if(!this.commentForm.value.newComment) {
      this.submitIcon = 'paper-plane';
    } else {
      this.submitIcon = 'paper-plane-outline';
    }
  }


  async addNewComment() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }

    const accountChoice = await this._modalService.displayChooseProfileModal()
    const comment = new Comment({
      postId: this.post.id,
      body: this.commentForm.value.newComment.trim(),
      author: new NeatBoutiqueEntity({
        id: accountChoice.user.id,
        name: accountChoice.user.name,
        role: accountChoice.accountRole,
        avatarSourceURL: accountChoice.user.avatarSourceURL,
      }),
    });

    let commentAdded: any;
    if(!this.isDemo) {
      commentAdded = await this._categoryService.createCommentOnPost(comment);
    
    // is a vendor poll demo
    } else {
      comment.createdDateUtc = new Date();
      comment.lastUpdatedDateUtc = new Date();
      commentAdded = new CommentDisplay(comment);
      commentAdded.id = 'demo';
    }
    
    if(commentAdded || this.isDemo) {
      this.commentForm.reset();      
      this.commentForm.patchValue({ newComment: null });
      commentAdded.author = comment.author;
      this.post.comments.unshift(commentAdded);

      if(!this.showAllComments) {
        this.shownComments = this.post.comments.slice(0, this._minCommentCount);
      } else {
        this.shownComments = this.post.comments;
      }
    }
    
    
  }

}
