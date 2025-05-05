import { Injectable } from "@angular/core";
// import { AuthService } from "../auth/auth.service";

import { CurrentUserDisplay } from "../models/current-user-display";
import { AccountsService } from "./accounts.service";
import { CategoryService } from "./category.service";
import { Post, MyQuestionsRequest, NeatBoutiqueApiService, PostsResponse, CategoryType } from "./neat-boutique-api.service";
import { PostDisplay } from "../models/post-display";

@Injectable({
  providedIn: "root",
})
export class MyQuestionsService {
  
  constructor(private _neatBoutiqueApiService: NeatBoutiqueApiService) {
    
  }

  // TODO: change to use actual end point when ready
  getMyQuestions() {
    var request = new MyQuestionsRequest();
    request.pageNumber = 0;
    request.pageSize = 15;
    var promise = new Promise<PostDisplay[]>((resolve, reject) => {
      this._neatBoutiqueApiService.getMyQuestions(request).subscribe((response: PostsResponse) => {
        if (response.isSuccess) {
          var posts = response.posts.map(x => new PostDisplay(x))
          resolve(posts);
        } else {
          reject();
        }
      });
    });
    return promise;
  }

}
