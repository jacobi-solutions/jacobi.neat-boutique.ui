import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { API_BASE_URL, NeatBoutiqueApiService } from './services/neat-boutique-api.service';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage-angular';
import { AppRoutingModule } from './app-routing.module';

import { TokenInterceptorService } from './token-interceptor.service';
import { SharedModule } from './shared/shared.module';
import { AuthConfig } from './auth/auth.config';
import { AuthFlowPageModule } from './auth/auth-flow/auth-flow.module';
import { AuthModule } from './auth/auth.module';


const firebaseConfig = {
  apiKey: environment.firebaseApiKey,
  authDomain: environment.firebaseAuthDomain,
};

const authConfig = new AuthConfig({
  firebaseConfig: firebaseConfig,
  appUiBaseUrl: environment.neatBoutiqueUIBaseUrl,
  appApiBaseUrl: environment.neatBoutiqueApiBaseUrl,
  signInRedirectUrl: '/home',
  signUpRedirectUrl: '/home',
  unauthenticatedRedirect: '/auth-flow/sign-in',
  hasFacebookButton: environment.production,
  hasAppleButton: environment.production,
  legalLinks: { privacyPolicy: '/legal/privacy-policy', termsAndConditions: '/legal/terms-of-service' },
  splitScreenOptions: {
    images: {
      signIn: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
      signUp: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
    }
  }
});


export function getAPIBaseUrl(): string {
  return environment.neatBoutiqueApiBaseUrl;
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot({ animated: false }),
        AppRoutingModule,
        IonicStorageModule.forRoot(),
        //AuthFlowPageModule,
        AuthModule.forRoot(authConfig),
        HttpClientModule,
        SharedModule,
    ],
    providers: [
        StatusBar,
        NeatBoutiqueApiService,
        Storage,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: API_BASE_URL, useFactory: getAPIBaseUrl },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}