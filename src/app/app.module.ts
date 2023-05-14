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
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { Capacitor } from '@capacitor/core';
import { getApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence } from 'firebase/auth';
import { Facebook } from '@awesome-cordova-plugins/facebook';

// import { FIREBASE_APP } from './auth/auth.service';
// import { FirebaseApp, initializeApp } from 'firebase/app';



// const authConfig = new AuthConfig({
//   firebaseConfig: environment.firebaseConfig,
//   appUiBaseUrl: environment.neatBoutiqueUIBaseUrl,
//   appApiBaseUrl: environment.neatBoutiqueApiBaseUrl,
//   signInRedirectUrl: '/home',
//   signUpRedirectUrl: '/home',
//   unauthenticatedRedirect: '/auth-flow/sign-in',
//   hasFacebookButton: environment.production,
//   hasAppleButton: environment.production,
//   legalLinks: { privacyPolicy: '/legal/privacy-policy', termsAndConditions: '/legal/terms-of-service' },
//   splitScreenOptions: {
//     images: {
//       signIn: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
//       signUp: 'https://storage.googleapis.com/neat-boutique-dev/images/clark-street-mercantile-qnKhZJPKFD8-unsplash.jpg',
//     }
//   }
// });


export function getAPIBaseUrl(): string {
  return environment.lociApiBaseUrl;
}

// export function getFirebaseApp(): FirebaseApp {
//   return initializeApp(environment.firebaseConfig);
// }

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
        //AuthModule.forRoot(authConfig),
        HttpClientModule,
        SharedModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAnalytics(() => getAnalytics()),
        provideAuth(() => {
          if (Capacitor.isNativePlatform()) {
            return initializeAuth(getApp(), {
              persistence: indexedDBLocalPersistence
            });
          } else {
            return getAuth();
          }
        }),
    ],
    providers: [
        StatusBar,
        NeatBoutiqueApiService,
        Storage,
        Facebook,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: API_BASE_URL, useFactory: getAPIBaseUrl },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
        ScreenTrackingService,UserTrackingService, 
        //{ provide: FIREBASE_APP, useFactory: getFirebaseApp }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}