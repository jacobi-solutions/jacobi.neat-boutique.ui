import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NbRoutingService {

  constructor(private _router: Router) {}

  public goToVendorListByCategory(categoryName: string) {
    const urlFriendlyCategory = this.categoryNameToFriendlyUrlPart(categoryName);
    this._router.navigateByUrl(`/vendor-list/${urlFriendlyCategory}`);
  }

  public categoryNameToFriendlyUrlPart(categoryName) {
    return categoryName.toLowerCase().replace(/\s/g, '-').replace(/\&/g, "and");
  }


  getCategoryNameFromRoute(activatedRoute: ActivatedRoute) {
    const routeParams = activatedRoute.snapshot.paramMap;    
    const rawCategoryName = routeParams.get('categoryName'); 

    let cleanWithAmpersand = this.categoryFriendlyUrlPartToName(rawCategoryName);
    return cleanWithAmpersand;
  }

  public categoryFriendlyUrlPartToName(words: string) {
    const categoryWordsWithDash = words.split('-');   
    return categoryWordsWithDash.map(word => {
      const wordArray = [...word];
      wordArray[0] = wordArray[0].toUpperCase();
      return wordArray.join('');
    }).join(' ').replace(/(and)/i, '&');
  }
}


