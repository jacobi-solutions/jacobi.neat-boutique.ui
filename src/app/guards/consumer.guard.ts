import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountsService } from 'src/app/services/accounts.service';
import { CurrentUserDisplay } from '../models/current-user-display';
@Injectable({ providedIn: 'root' })
export class ConsumerGuard implements CanActivate {
  private _currentUser: CurrentUserDisplay;
  constructor(private router: Router, private _accountsService: AccountsService) {

    this._accountsService.currentUserSubject.subscribe((currentUser: CurrentUserDisplay) => {
      if(currentUser) {
         this._currentUser = currentUser;
      }
    });
  }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let redirect = route.data["redirect"] as string;

        const promise = new Promise<boolean | UrlTree>((resolve, reject) => {
          if(this._currentUser?.vendors?.length > 0) {
            resolve(this.router.parseUrl(redirect));
          } else {
            resolve(true);
          }
        });

        return promise;
    }
}
