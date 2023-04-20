import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NbRoutingService {

  constructor(private _router: Router) {}

  public goToVendorListByCategory(communityName: string) {
    const urlFriendlyCategory = this.communityNameToFriendlyUrlPart(communityName);
    this._router.navigateByUrl(`/vendor-list/${urlFriendlyCategory}`);
  }

  public communityNameToFriendlyUrlPart(communityName) {
    return communityName.toLowerCase().replace(/\s/g, '-').replace(/\&/g, "and");
  }


  getCategoryNameFromRoute(activatedRoute: ActivatedRoute) {
    const routeParams = activatedRoute.snapshot.paramMap;    
    const rawCategoryName = routeParams.get('categoryName'); 

    let cleanWithAmpersand = this.communityFriendlyUrlPartToName(rawCategoryName);
    return cleanWithAmpersand;
  }

  public communityFriendlyUrlPartToName(words: string) {
    const categoryWordsWithDash = words.split('-');   
    return categoryWordsWithDash.map(word => {
      const wordArray = [...word];
      wordArray[0] = wordArray[0].toUpperCase();
      return wordArray.join('');
    }).join(' ').replace(/(and)/i, '&');
  }
}


