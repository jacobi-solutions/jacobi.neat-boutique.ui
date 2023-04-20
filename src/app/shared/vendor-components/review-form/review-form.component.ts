import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { ReviewDisplay } from 'src/app/models/review-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ModalService } from 'src/app/services/modal.service';
import { Review } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
})
export class ReviewFormComponent implements OnInit {

  @Input() vendor: VendorDisplay;
  @Input() reviewToEdit: ReviewDisplay;
  @Output() onDoneEditing: EventEmitter<ReviewDisplay> = new EventEmitter();

  public currentUser: CurrentUserDisplay;
  public showReviewForm: boolean = false;
  public reviewIcon: string;
  public submitIcon: string = 'paper-plane-outline';
  public reviewForm = new UntypedFormGroup({
    title: new UntypedFormControl(null, [Validators.minLength(1)]),
    body: new UntypedFormControl(null, [Validators.minLength(1)]),
    rating: new UntypedFormControl(5, []),
  });
  
  constructor(private _accountService: AccountsService, private _consumerAction: ConsumerService, private _authService: AuthService,
    private _activatedRoute: ActivatedRoute, private _router: Router, private _modalService: ModalService) {
    this.reviewIcon = this.showReviewForm ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
  }

  ngOnInit() {
    this._accountService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this.currentUser = user;
    });
    
    if(this.reviewToEdit) {
      this._updateReviewPrefill();
    }    

    this.reviewForm.valueChanges.subscribe(values => {
      if(values.rating === 0) {
        this.reviewForm.patchValue({ rating: 5 });
      }
    })
  }

  toggleShowReviewForm() {
    this.showReviewForm = !this.showReviewForm;
    this.reviewIcon = this.showReviewForm ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
  }


  async addNewReview() {  
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

    if(!this.reviewForm.invalid && this.vendor) {
      const newReview: Review = await this._consumerAction.addReviewToVendor({
        vendorId: this.vendor.id,
        rating: this.reviewForm.value.rating,
        title: this.reviewForm.value.title,
        body: this.reviewForm.value.body
      });

      if(newReview) {
        this.vendor.reviewCount += 1;
      }

      this.reviewForm.reset();
      this.reviewForm.patchValue({ rating: 0 });    
      this.vendor.reviews.unshift(new ReviewDisplay(newReview));
    }
  }


  async updateReview() {
    this.reviewToEdit.title = this.reviewForm.value.title;
    this.reviewToEdit.body = this.reviewForm.value.body;
    this.reviewToEdit.rating = this.reviewForm.value.rating;

    const editedReview: ReviewDisplay = await this._consumerAction.updateReviewOnVendor(this.reviewToEdit);
    this.onDoneEditing.emit(editedReview);
  }

  cancelUpdateReview() {
    this.onDoneEditing.emit(this.reviewToEdit);
  }

  private _updateReviewPrefill() {
    this.reviewForm.setValue({
      title: this.reviewToEdit.title, 
      body: this.reviewToEdit.body,
      rating: this.reviewToEdit.rating,
    });    
  }

}
