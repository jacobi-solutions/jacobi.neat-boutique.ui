import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HeaderDisplay } from '../models/header-display';



@Injectable({
  providedIn: 'root'
})
export class HeaderGuard implements CanActivate {
  public headerDisplaySubject: BehaviorSubject<HeaderDisplay> = new BehaviorSubject<HeaderDisplay>(null);
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      var headerDisplay = new HeaderDisplay();
      headerDisplay.selectedPageName = route.data?.title ?? '';
      headerDisplay.showMarquee = route.data?.showMarquee ?? false;
      headerDisplay.showNbHeader2 = route.data?.showNbHeader2 ?? false;
      headerDisplay.showNbHeader3 = route.data?.showNbHeader3 ?? false;
      this.headerDisplaySubject.next(headerDisplay);

    return true;
  }
  
}
