import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { CommunityCategory } from 'src/app/models/community-category';
import { UserRoleTypes } from 'src/app/models/constants';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { CommunityService } from 'src/app/services/community.service';
import { ModalService } from 'src/app/services/modal.service';
import { Post, NeatBoutiqueEntity } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-post-question',
  templateUrl: './post-question.component.html',
  styleUrls: ['./post-question.component.scss'],
})
export class PostQuestionComponent implements OnInit {
  @ViewChild('newPost', { read: ElementRef }) newPostInput: ElementRef;
  @ViewChild('questionMarkPlaceholder', { read: ElementRef }) questionMarkPlaceholder: ElementRef;
  @ViewChild('categorySelection', { read: ElementRef }) categorySelection: ElementRef;
  @ViewChild('submitPostIcon', { read: ElementRef }) submitPostIcon: ElementRef;
  @Output() onPost: EventEmitter<any> = new EventEmitter<any>();
  public postWithQuestionMark: string = null;
  private _newPostInputMaxWidth: number;
  private _maxNewPostInputLength: number = 0;
  public newPostIcon: string = 'paper-plane-outline';
  public postForm = new UntypedFormGroup({
    newQuestion: new UntypedFormControl('', [Validators.minLength(3)]),
    communityName: new UntypedFormControl('', [ Validators.required ])
  });

  private _postNoticeModal: HTMLIonModalElement;
  public communities: CommunityCategory[];
  public currentUser: CurrentUserDisplay = null;
  constructor(private _communityService: CommunityService, private _modalService: ModalService, 
    private _accountService: AccountsService, private _authService: AuthService) { 

    this.communities = this._communityService.communities;
  }

  ngOnInit() {
    this._accountService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this.currentUser = user;
    });
  }
  ngAfterViewChecked() {
    const nativeInput = [...this.newPostInput.nativeElement.childNodes].filter((el) => el.localName === 'input')[0];
    var offsetWidth = 0;
    if(this.submitPostIcon.nativeElement.scrollWidth && this.categorySelection?.nativeElement?.scrollWidth) {
      offsetWidth = this.submitPostIcon.nativeElement.scrollWidth + this.categorySelection?.nativeElement?.scrollWidth;
    }
    if(nativeInput) {
      if(offsetWidth > 0) {
        nativeInput.style.maxWidth = `${this.newPostInput.nativeElement.scrollWidth - offsetWidth - 50}px`;
      } else {
        nativeInput.style.maxWidth = '65%';
      } 
      this._newPostInputMaxWidth = nativeInput?.offsetWidth;  
    }    
  }

  ngAfterContentChecked() {
    if(this._newPostInputMaxWidth && this.questionMarkPlaceholder?.nativeElement.offsetWidth >= this._newPostInputMaxWidth) {
      this._maxNewPostInputLength = this.questionMarkPlaceholder?.nativeElement.innerText.length;
    }
  }
  newPostChange(event) {
    if(!this._maxNewPostInputLength || (this._maxNewPostInputLength >= this.postForm.value.newQuestion.length)) {
      this.postWithQuestionMark = (this.postForm.value.newQuestion.replace(/\s/g,'.'));
    }
  }

  async addNewPost() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }

    if(!this.currentUser.consumer.name) {
      const data = await this._modalService.displayUsernameAndEmailModal();      
      if(data?.username) {
        this._authService.changeUsername(data.username);
      } else { 
        return;
      }
    } 
    
    const post =  new Post();
    post.communityName = this.postForm.value.communityName;
    post.question = this.postForm.value.newQuestion.trim();
    post.author = new NeatBoutiqueEntity({
      name: this.currentUser?.consumer.name,
      avatarSourceURL: this.currentUser?.consumer.avatarSourceURL,
      role: UserRoleTypes.CONSUMER,
      id: this.currentUser?.consumer.id
    })

    if(!post.question.endsWith('?')) {
      post.question += '?';
    }

    const questionCharArray = [...post.question];
    questionCharArray[0] = questionCharArray[0].toUpperCase();
    post.question = questionCharArray.join('');

    this._communityService.createConsumerPost(post);
    this.postForm.reset();
    this.newPostIcon = 'paper-plane-outline';
    this.postWithQuestionMark = null;

    var community = this.communities.find(x => x.name === post.communityName);
    this.updateSelectedCommunities(community);
    this.onPost.emit();
  }

  updateSelectedCommunities(community) {  
    community.isSelected = true;
    this._communityService.updateShownCommunities();
  }

  async confirmNonEditablePost() {
    if(this.postForm?.value?.newQuestion === '' || this.postForm?.value?.communityName === '') return;
    const self = this;
    const showCancelBtn = true;
    const html = `
      <h1>Great question!</h1>
      <p class="text-left-align modal-p-min">
      Please note: Questions you ask can only be answered with the name of a local business and will be voted on by other users. Questions will not be able to be edited after posting. After you’ve posted your question, feel free to explore other questions and post your best answer. 
      </p>
    `;

    const confirmBtn = {
      label: 'Post now',
      // callback: this.addNewPost
      callback() {
        // self.userHasSeenNonEditableModal = true;
        // self._communityService.userHasSeenNonEditableModal = true;
        self.addNewPost();
        self._postNoticeModal.dismiss();
      }
    };

    this._postNoticeModal = await this._modalService.displayConfirmActionModal(html, confirmBtn, showCancelBtn);
  }
}
