import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';


@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
    action: any;
    isAuthenticated: boolean;
    constructor(private _authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this._authService.getToken();

        if (token && req.url.includes(environment.neatBoutiqueApiBaseUrl)) {
            let newHeaders = req.headers;
            newHeaders = newHeaders.append('Authorization', `bearer ${token}`);
            const crossDomainReq = req.clone({headers: newHeaders});
            return next.handle(crossDomainReq);
        } else {
            return next.handle(req);
        }
   }
}
