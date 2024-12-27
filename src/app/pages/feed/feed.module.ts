import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryPageRoutingModule } from './feed-routing.module';

import { FeedPage } from './feed.page';
import { SharedModule } from 'src/app/shared/shared.module';
// import { PostItemComponent as PostItemComponent } from '../../shared/post-item/post-item.component';
// import { CommentItemComponent } from '../../shared/post-item/comment-list/comment-item/comment-item.component';
// import { AnswerListComponent } from '../../shared/post-item/answer-list/answer-list.component';
// import { CommentListComponent } from '../../shared/post-item/comment-list/comment-list.component';
// import { AnswerItemComponent } from '../../shared/post-item/answer-list/answer-item/answer-item.component';
import { ReactiveFormsModule } from '@angular/forms';
// FormsModule

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    FeedPage,
    // CommentItemComponent,
    // PostItemComponent,
    // AnswerListComponent,
    // // AnswerItemComponent,
    // CommentListComponent,
  ]
})
export class CategoryPageModule {}
