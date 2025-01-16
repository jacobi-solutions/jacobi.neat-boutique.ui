import { Component, OnInit } from '@angular/core';
import { PostDisplay } from 'src/app/models/post-display';
import { CategoryTypes } from 'src/app/constants/category-types';
import { CategoryService } from 'src/app/services/category.service';
import { MyQuestionsService } from 'src/app/services/my-questions.service';

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.page.html',
  styleUrls: ['./my-questions.page.scss'],
})
export class MyQuestionsPage implements OnInit {

  public pageName: string = 'My Questions';
  public questionPosts: PostDisplay[];

  constructor(private _myQuestionsService: MyQuestionsService) { }

  ngOnInit() {
    this._loadQuestions();
  }

  private _loadQuestions() {
    
    this._myQuestionsService.getMyQuestions().then((posts: PostDisplay[]) => {      
      this.questionPosts = posts;
    });


  }
}
