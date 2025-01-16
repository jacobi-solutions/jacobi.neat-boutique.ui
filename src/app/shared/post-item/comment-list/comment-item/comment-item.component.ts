import { Component, Input, OnInit } from "@angular/core";
import { waitForAsync } from "@angular/core/testing";
import { ModalController, PopoverController } from "@ionic/angular";
import { CommentDisplay } from "src/app/models/comment-display";
import { CurrentUserDisplay } from "src/app/models/current-user-display";
import { UserRoleTypes } from "src/app/constants/user-role-types";
import { CategoryService } from "src/app/services/category.service";
import { AccountsService } from "src/app/services/accounts.service";
import { ModalService } from "src/app/services/modal.service";
import { ConsumerProfile, NeatBoutiqueEntity, VendorProfile } from "src/app/services/neat-boutique-api.service";
import { ConfirmationActionModalComponent } from "src/app/shared/modals/confirmation-action-modal/confirmation-action-modal.component";
import { PopoverComponent } from "src/app/shared/popovers/popover/popover.component";
import { PopoverItem } from "src/app/shared/popovers/types/popover-types";
import { Router } from "@angular/router";

@Component({
  selector: "app-comment-item",
  templateUrl: "./comment-item.component.html",
  styleUrls: ["./comment-item.component.scss"],
})
export class CommentItemComponent implements OnInit {
  @Input() comment: CommentDisplay;
  @Input() reportStatusToParentCallback: Function;
  @Input() isDemo: boolean = false;

  public isLiked: boolean;
  public isDeleted: boolean;
  public isAuthor: boolean;
  public showMoreOptions: boolean;
  public likeIcon: string = "heart-outline";
  public currentUser: CurrentUserDisplay = null;
  private _optionsPopover: HTMLIonPopoverElement;
  private _confirmDeleteModal: HTMLIonModalElement;

  constructor(
    private _categoryService: CategoryService,
    private _customersService: AccountsService,
    private _popoverController: PopoverController,
    private _modalService: ModalService,
    private _router: Router
  ) {}


  ngOnInit() {
    this._customersService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this.currentUser = user;
      if(user) {
        this._isLikedCheck();
        this._isAuthorCheck();  
      }
    });    
  }
  
  goToConsumerProfilePage(author: NeatBoutiqueEntity) {
    let route = `/profile/${author.profilePath}`;
    this._router.navigate([route], { state: { consumerProfileEntity: author } });
  }

  async toggleLikeComment() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }

    let comment: CommentDisplay;

    // fake liking/unlike
    if(this.isDemo) {
      this.isLiked = !this.isLiked;
      return;
    }


    if(this.isLiked) {
      comment = await this._categoryService.unlikeComment(this.comment);
      this.comment.likers = comment.likers;
      if(comment) {
        this.isLiked = false;
      }
    } else {
      comment = await this._likeComment();
      this.comment.likers = comment.likers;
      if(comment) {
        this.isLiked = true;
      }
    }  
  }


  private async _likeComment() {
    if(this.isDemo) {
      return null;
    }

    // const commentAccount = await this._modalService.displayChooseProfileModal();
    return await this._categoryService.likeComment(this.comment, this.currentUser.consumer.id);
  }

  
  async presentCommentOptions(ev: any) {
    const popoverItems: PopoverItem[] = [
      {
        label: "Delete",
        isClickable: true,
        callback: this._presentCommentDeleteWarning(),
      },
    ];

    this._optionsPopover = await this._popoverController.create({
      component: PopoverComponent,
      componentProps: { itemList: popoverItems },
      cssClass: "comment-options",
      showBackdrop: false,
      event: ev,
      translucent: true,
    });

    this._optionsPopover.onDidDismiss().then((data) => {
      this.showMoreOptions = false;
    });
    this._optionsPopover.present().then((data) => {
      this.showMoreOptions = true;
      return data;
    });
  }


  private _presentCommentDeleteWarning() {
    const self = this;
    return async () => {
      const confirmBtn = {
        label: 'Delete',
        callback() {
          if(!self.isDemo) {
            self._categoryService.removeCommentFromPost(self.comment);
          }
          
          self.comment.isDeleted = true;
          self.reportStatusToParentCallback();
          self._confirmDeleteModal.dismiss();
        }
      }
  
      self._confirmDeleteModal = await self._modalService.displayConfirmActionModal(
        `<p>Are you sure you want to delete this comment?</p>`,
        confirmBtn
      );
  
      self._confirmDeleteModal.onDidDismiss().then(data => {
        self._optionsPopover.dismiss();
        return data;
      });
    }
  }


  private _isLikedCheck() {
    if(this.comment?.likers) {
      const likeIds = this.comment?.likers.map(liker => liker.id);
      this.isLiked = this.currentUser?.hasIdInList(likeIds);
    }
  }

  
  private _isAuthorCheck() {
    this.isAuthor = this.currentUser?.hasId(this.comment.author.id);
  }
}
