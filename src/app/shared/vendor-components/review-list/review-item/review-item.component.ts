import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { ReviewDisplay } from 'src/app/models/review-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ModalService } from 'src/app/services/modal.service';
import { NeatBoutiqueEntity } from 'src/app/services/neat-boutique-api.service';
import { PopoverComponent } from 'src/app/shared/popovers/popover/popover.component';
import { PopoverItem } from 'src/app/shared/popovers/types/popover-types';

@Component({
  selector: 'app-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss'],
})
export class ReviewItemComponent implements OnInit {
  @Input() review: ReviewDisplay;
  @Output() onDelete: EventEmitter<boolean> =  new EventEmitter<boolean>(null);

  public currentUser: CurrentUserDisplay;
  public currentUserIsAuthor: boolean;
  public showMoreOptions: boolean;
  public editReview: boolean;
  private _optionsPopover: HTMLIonPopoverElement;
  private _confirmDeleteModal: HTMLIonModalElement;

  constructor(
    private _consumerAction: ConsumerService,
    private _customersService: AccountsService,
    private _popoverController: PopoverController,
    private _modalService: ModalService,
    private _router: Router
  ) { }

  ngOnInit() {    
    this._customersService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this.currentUser = user;
      if(user) {
        this._isAuthorCheck();  
      }
    });
  }

  goToConsumerProfilePage(author: NeatBoutiqueEntity) {
    let route = `/profile/${author.profilePath}`;
    this._router.navigate([route], { state: { consumerProfileEntity: author } });
  }

  async presentReviewOptions(ev: any) {
    const popoverItems: PopoverItem[] = [
      {
        label: "Delete",
        isClickable: true,
        callback: this._presentReviewDeleteWarning(),
      },
      {
        label: "Edit",
        isClickable: true,
        callback: this._editReview(),
      }
    ];

    this._optionsPopover = await this._popoverController.create({
      component: PopoverComponent,
      componentProps: { itemList: popoverItems },
      cssClass: "review-options",
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


  setEditedReview(review: ReviewDisplay) {
    this.review = review;
    this.editReview = false;    
  }


  private _presentReviewDeleteWarning() {
    const self = this;
    return async () => {
      const confirmBtn = {
        label: 'Delete',
        callback: async () => {
          self.review.isDeleted = true;
          const didDelete: boolean = await self._consumerAction.removeReviewFromVendor(self.review);
          self.onDelete.emit(didDelete);
          self._confirmDeleteModal.dismiss();
        },

      }
      self._confirmDeleteModal = await self._modalService.displayConfirmActionModal(
        `<p>Are you sure you want to permanently delete this review?</p>
         <p>This action can <strong>NOT</strong> be undone.</p>`,
        confirmBtn
      );
      self._confirmDeleteModal.onDidDismiss().then(data => {
        self._optionsPopover.dismiss();
        return data;
      });
    }
  }

  private _editReview() {
    const self = this;
    return () => {
      self.editReview = true;
      self._optionsPopover.dismiss();
    }
  }


  private _isAuthorCheck() {
    this.currentUserIsAuthor = this.currentUser.hasId(this.review.author.id);
  }
}
