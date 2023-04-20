import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyQuestionsPageRoutingModule } from './my-questions-routing.module';

import { MyQuestionsPage } from './my-questions.page';
import { SharedModule } from 'src/app/shared/shared.module';
// import { AnswerItemComponent } from 'src/app/shared/post-item/answer-list/answer-item/answer-item.component';
// import { AnswerListComponent } from 'src/app/shared/post-item/answer-list/answer-list.component';
// import { CommentListComponent } from 'src/app/shared/post-item/comment-list/comment-list.component';
// import { PostItemComponent } from 'src/app/shared/post-item/post-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyQuestionsPageRoutingModule,
    SharedModule
  ],
  declarations: [
    MyQuestionsPage,
    // PostItemComponent,
    // AnswerListComponent,
    // // AnswerItemComponent,
    // CommentListComponent,
  ]
})
export class MyQuestionsPageModule {}
