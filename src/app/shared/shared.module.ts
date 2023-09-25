import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbHeaderComponent } from './nb-header/nb-header.component';
import { NbFooterComponent } from './nb-footer/nb-footer.component';
import { IonicModule } from '@ionic/angular';
import { ExpandableComponent } from './expandable/expandable.component';
import { NbHeaderMobileComponent } from './nb-header-mobile/nb-header-mobile.component';
import { MarqueeAdComponent } from './marquee-ad/marquee-ad.component';
 import { NbAvatarComponent } from './nb-avatar/nb-avatar.component';
import { PopoverComponent } from './popovers/popover/popover.component'; 
import { RequireLoginModalComponent } from './modals/require-login-modal/require-login-modal.component';
import { ChooseAccountModalComponent } from './modals/choose-account-type-modal/choose-account-type-modal.component';
import { ConfirmationActionModalComponent } from './modals/confirmation-action-modal/confirmation-action-modal.component';
import { NbButtonComponent } from './nb-button/nb-button.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDropDownPopoverComponent } from './popovers/form-drop-down-popover/form-drop-down-popover.component';
import { SummedRatingComponent } from './rate-vendor/summed-rating/summed-rating.component';
import { VendorReviewInputRatingComponent } from './rate-vendor/vendor-review-input-rating/vendor-review-input-rating.component';
import { JacobiButtonComponent } from './jacobi-button/jacobi-button.component';
import { SelectCommunitiesModalComponent } from './modals/vendor-settings-modals/select-communities-modal/select-communities-modal.component';
import { EditSocialMediaLinksModalComponent } from './modals/vendor-settings-modals/edit-social-media-links-modal/edit-social-media-links-modal.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';
import { EditHeroImgAdModalComponent } from './modals/vendor-settings-modals/edit-hero-img-ad-modal/edit-hero-img-ad-modal.component';
import { VendorListItemComponent } from './vendor-components/vendor-list-item/vendor-list-item.component';
import { RouterModule } from '@angular/router';
import { AnswerItemComponent } from './post-item/answer-list/answer-item/answer-item.component';
import { AnswerListComponent } from './post-item/answer-list/answer-list.component';
import { CommentItemComponent } from './post-item/comment-list/comment-item/comment-item.component';
import { CommentListComponent } from './post-item/comment-list/comment-list.component';
import { PostItemComponent } from './post-item/post-item.component';
import { ReviewFormComponent } from './vendor-components/review-form/review-form.component';
import { ReviewItemComponent } from './vendor-components/review-list/review-item/review-item.component';
import { ReviewListComponent } from './vendor-components/review-list/review-list.component';
import { PollAnswerItemComponent } from './post-item/answer-list/poll-answer-item/poll-answer-item.component';
import { ToolTipComponent } from './popovers/tool-tip/tool-tip.component';
import { ImgCropperComponent } from './img-cropper/img-cropper.component';
import { CropPhotoComponent } from './modals/upload-photo-modal/crop-photo/crop-photo.component';
import { UploadPhotoModalComponent } from './modals/upload-photo-modal/upload-photo-modal.component';
import { PaymentComponent } from './payment/payment.component';
import { PostQuestionComponent } from './post-question/post-question.component';
import { ChangeAvatarModalComponent } from './modals/change-avatar-modal/change-avatar-modal.component';
import { LocationModalComponent } from './modals/location-modal/location-modal.component';
import { NotificationSettingsModalComponent } from './modals/notification-settings-modal/notification-settings-modal.component';
import { FeedSettingsModalComponent } from './modals/feed-settings-modal/feed-settings-modal.component';
import { ChooseAnswerRankingModalComponent } from './modals/choose-answer-ranking-modal/choose-answer-ranking-modal.component';
import { UserSettingsPopoverComponent } from './popovers/user-settings-popover/user-settings-popover.component';
import { UsernameAndEmailModalComponent } from './modals/username-and-email-modal/username-and-email-modal.component';
import { MyListComponent } from './my-list/my-list.component';


@NgModule({
  declarations: [
    NbHeaderComponent,
    NbFooterComponent,
    NbHeaderMobileComponent,
    ExpandableComponent,
    MarqueeAdComponent,
    NbButtonComponent,
    NbAvatarComponent,
    PopoverComponent,
    FormDropDownPopoverComponent,
    RequireLoginModalComponent,
    ChooseAccountModalComponent,
    ConfirmationActionModalComponent,
    UserSettingsPopoverComponent,
    InputFieldComponent,
    SummedRatingComponent,
    VendorReviewInputRatingComponent,
    JacobiButtonComponent,
    SelectCommunitiesModalComponent,
    EditSocialMediaLinksModalComponent,
    TextareaFieldComponent,
    EditHeroImgAdModalComponent,
    VendorListItemComponent,
    AnswerItemComponent,
    AnswerListComponent,
    CommentItemComponent,
    CommentListComponent,
    PostItemComponent,
    PollAnswerItemComponent,
    ReviewFormComponent,
    ReviewListComponent,
    ReviewItemComponent,
    ToolTipComponent,
    ImgCropperComponent,
    UploadPhotoModalComponent,
    ChangeAvatarModalComponent,
    CropPhotoComponent,
    PaymentComponent,
    PostQuestionComponent,
    LocationModalComponent,
    NotificationSettingsModalComponent,
    FeedSettingsModalComponent,
    ChooseAnswerRankingModalComponent,
    UsernameAndEmailModalComponent,
    MyListComponent
  ],
  imports: [
    RouterModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    NbHeaderComponent,
    NbFooterComponent,
    NbHeaderMobileComponent,
    ExpandableComponent,
    MarqueeAdComponent,
    NbButtonComponent,
    NbAvatarComponent,
    PopoverComponent,
    FormDropDownPopoverComponent,
    RequireLoginModalComponent,
    ChooseAccountModalComponent,
    ConfirmationActionModalComponent,
    UserSettingsPopoverComponent,
    InputFieldComponent,
    SummedRatingComponent,
    VendorReviewInputRatingComponent,
    JacobiButtonComponent,
    SelectCommunitiesModalComponent,
    EditSocialMediaLinksModalComponent,
    TextareaFieldComponent,
    EditHeroImgAdModalComponent,
    VendorListItemComponent,
    AnswerItemComponent,
    AnswerListComponent,
    CommentItemComponent,
    CommentListComponent,
    PostItemComponent,
    PollAnswerItemComponent,
    ReviewFormComponent,
    ReviewListComponent,
    ReviewItemComponent,
    ToolTipComponent,
    ImgCropperComponent,  
    UploadPhotoModalComponent,
    ChangeAvatarModalComponent,
    CropPhotoComponent,
    PaymentComponent,
    PostQuestionComponent,
    LocationModalComponent,
    NotificationSettingsModalComponent,
    FeedSettingsModalComponent,
    ChooseAnswerRankingModalComponent,
    UsernameAndEmailModalComponent,
    MyListComponent
  ]
})
export class SharedModule { }
