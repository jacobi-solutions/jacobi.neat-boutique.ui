import { Inject, Injectable, InjectionToken, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import 'firebase/compat/auth';
import { getAuth, onAuthStateChanged, initializeAuth, updateProfile, verifyBeforeUpdateEmail, updatePassword,
  browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword, fetchSignInMethodsForEmail, 
  sendSignInLinkToEmail, signInWithEmailLink, createUserWithEmailAndPassword, sendEmailVerification,
  Auth, User, ActionCodeSettings, getRedirectResult, OAuthProvider, signInWithCredential, getAdditionalUserInfo, signInWithPopup, FacebookAuthProvider, signInWithRedirect, setPersistence } from "firebase/auth";
import { initializeApp, FirebaseApp } from 'firebase/app';
import { Router, UrlTree } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { sha256 } from 'js-sha256';

export const FIREBASE_APP = new InjectionToken<FirebaseApp>('FIREBASE_APP');

import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { AuthSplitScreenVersionConfig, AuthConfig } from './auth.config';
import { AccountsService } from '../services/accounts.service';
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';
import { FirebaseEventTypes } from '../models/firebase-event-types';
import { LociConstants } from '../models/constants';
export type AuthPageButtons = {
  // ctaButton?: TemplateRef<any>,
  cancelButton?: TemplateRef<any>
} | null;

export class AccountDeletion {
  userId: string | undefined;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public createAuthUserSubject: BehaviorSubject<User|null> = new BehaviorSubject<User|null>(null);
  public signInRedirectUrl: string;
  public signUpRedirectUrl: string;
  public hasFacebookButton: boolean;
  public hasAppleButton: boolean;
  public unauthenticatedRedirect: string;
  public legalLinks?: { privacyPolicy: string, termsAndConditions: string };
  public splitScreenOptions?: AuthSplitScreenVersionConfig;

  private _firebaseHasloadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _firebaseAuthToken: string;
  private _currentAuthUser: User|null;

  private _auth: Auth;

  private _analytics: Analytics;
  // auth page buttons
  // public authPageButtonsSubject: BehaviorSubject<AuthPageButtons> = new BehaviorSubject<AuthPageButtons>(null);

  



  constructor(@Inject(FIREBASE_APP) _firebaseApp: FirebaseApp, private _router: Router, private _config: AuthConfig, private _platform: Platform,
      private _facebook: Facebook, private _accountsService: AccountsService) {

    this._analytics = getAnalytics(_firebaseApp);
    this.signInRedirectUrl = <string>this._config.signInRedirectUrl;
    this.signUpRedirectUrl = <string>this._config.signUpRedirectUrl;
    this.unauthenticatedRedirect = this._config.unauthenticatedRedirect;
    this.hasFacebookButton = this._config?.hasFacebookButton;
    this.hasAppleButton = this._config?.hasAppleButton;
    this.legalLinks = this._config?.legalLinks;
    this.splitScreenOptions = this._config?.splitScreenOptions;

    
    const firebaseApp = initializeApp(this._config.firebaseConfig);
    this._auth = getAuth(firebaseApp);

    this.listenForFacebookRedirect();
    var self = this;
    onAuthStateChanged(this._auth, (user) => {
      if (user) {
        var firebaseUser: any = user;
        this._firebaseHasloadedSubject.next(true);
        this._currentAuthUser = user;
        this._accountsService.preloadConsumerProfile(this._currentAuthUser);
        this._firebaseAuthToken = firebaseUser.accessToken;
        if(this._firebaseAuthToken) {
          this._accountsService.loadAccounts();
        } else {
          this._accountsService.unLoadAccounts();
        }
        // user.getIdToken().then((token) => {
          
        // });
      } else {
        this._currentAuthUser = null;
        this._firebaseHasloadedSubject.next(true);
      }
    });
  }


  setAuthButtons(buttons: AuthPageButtons) {
    // this.authPageButtonsSubject.next(buttons);
  }

  private listenForFacebookRedirect() {
    getRedirectResult(this._auth)
    .then((credential) => {
      if (credential?.user) {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_FACEBOOK_REDIRECT,  {
          LC_user: credential.user.displayName,
          LC_operationType: credential.operationType,
          LC_providerId: credential.providerId
        });
        console.log("facebook redirect");
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = credential.user.refreshToken;
        var additionalUserInfo = getAdditionalUserInfo(credential);
        if(additionalUserInfo?.isNewUser) {
          logEvent(this._analytics, FirebaseEventTypes.AUTH_NEW_FACEBOOK_USER,  {
            LC_user: credential.user.displayName,
            LC_operationType: credential.operationType,
            LC_providerId: credential.providerId
          });
          this._accountsService.createAccount(credential.user.uid, credential.user.displayName, credential.user.email).then((customer) => {
            if(customer) {
              this._router.navigateByUrl(this.signUpRedirectUrl);
            }
          });
          
        } else {
          logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_FACEBOOK_USER,  {
            LC_user: credential.user.displayName,
            LC_operationType: credential.operationType,
            LC_providerId: credential.providerId
          });
          this._router.navigateByUrl(this.signInRedirectUrl);
        }
        // ...
      }
    }).catch((error) => {
      logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_FACEBOOK_REDIRECT,  { 
        LC_error: error,
        LC_errorCode: error?.code,
        LC_errorMessage: error?.message
      });
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

 
  getEmail() {
    return this._auth.currentUser?.email;
  }

  public changeUsername(username: string) {
      logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
        LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user",
        LC_newUsername: username
      });
      updateProfile(this._currentAuthUser as User, {
        displayName: username
      }).then(() => {
        this._auth.currentUser?.getIdToken(true)
        this._accountsService.updateUsername(username);
      }).catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_CHANGE_USERNAME,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
      });
    
    
  }
  
  public changePhotoURL(photoUrl: string) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user",
      LC_newPhotoUrl: photoUrl
    });
    const promise = new Promise((resolve, reject) => {
      updateProfile(this._currentAuthUser as User, {
        photoURL: photoUrl
      })
      .then(() => {
        this._auth.currentUser?.getIdToken(true)
      }).catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_CHANGE_PHOTO_URL,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        reject(error);
      });
    });
    return promise;
  }

  changeEmail(email: string) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user",
      LC_newEmail: email
    });
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/sign-in`,
      handleCodeInApp: true
    };
    const promise = new Promise((resolve, reject) => {
      verifyBeforeUpdateEmail(this._currentAuthUser as User, email, actionCodeSettings).then(() => {
        resolve(true);
      }).catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_CHANGE_EMAIL,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        // console.log(error)
      });
    });
    return promise;
  }

  deleteAccountInit() {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_DELETE_ACCOUNT_INIT,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    var userId = this._auth.currentUser?.uid;
    var accountDeletion = new AccountDeletion();
    accountDeletion.token = this._uniqueStr(32);
    accountDeletion.userId = userId;
    this._accountsService.deleteAuthUserInit(accountDeletion);
    return accountDeletion;
  }

  deleteAccountFinal(accountDeletion: AccountDeletion|null) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_DELETE_ACCOUNT_FINAL,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    this._accountsService.deleteAuthUserInit(accountDeletion);
    
    const promise = new Promise<void>((resolve, reject) => {
      this._auth.currentUser?.delete().then(() => {
        this._accountsService.deleteAuthUserFinal(accountDeletion);
        resolve();
      }).catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_DELETE_ACCOUNT_FINAL,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        this.deleteAccountRollback(accountDeletion);
        reject();
      });
    });
    return promise;
  }

  deleteAccountRollback(accountDeletion: AccountDeletion|null) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_DELETE_USER_ACCOUNT_ROLLBACK,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    this._accountsService.deleteAccountRollBack(accountDeletion);
  }

  resetPassword(password: string) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_RESET_PASSWORD,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    const promise = new Promise((resolve, reject) => {
      updatePassword(this._currentAuthUser as User, password).then(() => {
        resolve(true);
      }).catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_RESET_PASSWORD,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        var test = error;
      });
    });
    return promise;
  }
  private _uniqueStr(stringLength: number=32) {
    var result: string[] = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // _-$#@!?
    var charactersLength = characters.length;
    for (var i = 0; i < stringLength; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }
  
  async _createFirebaseUserFromApple(identityToken, givenName, familyName, rawNonce) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_CREATE_APPLE_USER,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user",
    });
    // Create a custom OAuth provider    
    const provider = new OAuthProvider('apple.com');
 
    // Create sign in credentials with our token
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: rawNonce, 
    });
    
    // Call the sign in with our created credentials
    signInWithCredential(this._auth, credential).then((userCredential) => {
      if(givenName !== '' && familyName !== '') {
        updateProfile(this._currentAuthUser as User, {
          displayName: givenName + familyName
        });
      }
      var additionalUserInfo = getAdditionalUserInfo(userCredential);
      if(additionalUserInfo?.isNewUser) {
        this._accountsService.createAccount(userCredential.user.uid, userCredential.user.displayName, userCredential.user.email).then((success) => {
          if(success) {
            this._router.navigateByUrl(this.signUpRedirectUrl);
          }
        });
      } else {
        this._router.navigateByUrl(this.signInRedirectUrl);
      }
    })
    .catch(error => {
      logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_CREATE_APPLE_USER,  { 
        LC_error: error,
        LC_errorCode: error?.code,
        LC_errorMessage: error?.message
      });
      console.log(error);
    });
  }

  signInUserWithApple() {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_APPLE_USER,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    var rawNonce = this._uniqueStr(10);
    var hashedNonce = sha256(rawNonce);

    if (this._platform.is('ios') || this._platform.is('ipad') || this._platform.is('iphone')){
      let options: SignInWithAppleOptions = {
        clientId: this._config.appleClientId,
        redirectURI: this._config.signInRedirectUrl,
        scopes: 'email name',
        state: '12345',
        nonce: hashedNonce,
      };
      
      SignInWithApple.authorize(options)
        .then(async (res: SignInWithAppleResponse) => {
          await this._createFirebaseUserFromApple(res.response.identityToken, res.response.givenName, res.response.familyName, rawNonce);
        })
        .catch(error => {
          logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_USER_APPLE_DEVICE,  { 
            LC_error: error,
            LC_errorCode: error?.code,
            LC_errorMessage: error?.message
          });
          console.log("error: " + error)
        });
    } else {
      var provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      signInWithPopup(this._auth, provider).then((userCredential) => {
        var additionalUserInfo = getAdditionalUserInfo(userCredential);
        if(additionalUserInfo?.isNewUser) {
          this._accountsService.createAccount(userCredential.user.uid, userCredential.user.displayName, userCredential.user.email).then((customer) => {
            if(customer) {
              this._router.navigateByUrl(this.signUpRedirectUrl);
            }
          });
        } else {
          this._router.navigateByUrl(this.signInRedirectUrl);
        }
        })
        .catch(error => {
          logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_USER_APPLE,  { 
            LC_error: error,
            LC_errorCode: error?.code,
            LC_errorMessage: error?.message
          });
          // Handle error
        });
    }
  }

  signInUserWithFacebook(): void {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_FACEBOOK_USER,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    console.log("facebook auth");
    if (this._platform.is("capacitor")) {
      this.nativeFacebookAuth();
    } else {
      this.browserFacebookAuth();
    }
  }
  async nativeFacebookAuth(): Promise<void> {
    try {
      logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
        LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
      });
      console.log("native facebook auth");
      const response = await 
      this._facebook.login(["public_profile"]).then((response) => {
        console.log(response);
        if (response.authResponse) {
          console.log("facebook auth response");
          // User is signed-in Facebook.
          const unsubscribe = onAuthStateChanged(this._auth, firebaseUser => {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(response.authResponse, firebaseUser)) {
              // Build Firebase credential with the Facebook auth token.
              const credential = FacebookAuthProvider.credential(
                response.authResponse.accessToken
              );
              // Sign in with the credential from the Facebook user.
              console.log("Sign in with the credential from the Facebook user.");
              signInWithCredential(this._auth, credential).then((userCredential) => {
                var additionalUserInfo = getAdditionalUserInfo(userCredential);
                if(additionalUserInfo?.isNewUser) {
                  this._accountsService.createAccount(userCredential.user.uid, userCredential.user.displayName, userCredential.user.email).then((customer) => {
                    if(customer) {
                      this._router.navigateByUrl(this.signUpRedirectUrl);
                    }
                  });
                } else {
                  this._router.navigateByUrl(this.signInRedirectUrl);
                }
              })
              .catch(error => {
                console.log(error);
              });
            } else {
              // User is already signed-in Firebase with the correct user.
              console.log("already signed in");
            }
          });
        } else {
          // User is signed-out of Facebook.
          this._auth.signOut();
        }
      });
      
      
    } catch (error) {
      logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_NATIVE_FACEBOOK_USER,  { 
        LC_error: error,
        LC_errorCode: error?.code,
        LC_errorMessage: error?.message
      });
      console.log(error);
    }
  }

  isUserEqual(facebookAuthResponse, firebaseUser): boolean {
    var sameUser = false;
    if (firebaseUser) {
      const providerData = firebaseUser.providerData;
      
      providerData.forEach((data) => {
        if (
          data.providerId === FacebookAuthProvider.PROVIDER_ID &&
          data.uid === facebookAuthResponse.userID
        ) {
          // We don't need to re-auth the Firebase connection.
          sameUser = true;
        }

      });
    }
    return sameUser;
  }

  browserFacebookAuth() {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_BROWSWER_FACEBOOK_USER,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    
    console.log("browser facebook auth");
    var provider = new FacebookAuthProvider();
    
    signInWithRedirect(this._auth, provider)
    .then((result: any) => {
      console.log("sign-in-with-facebook-redirect");
      if(result?.additionalUserInfo?.isNewUser) {
        this._accountsService.createAccount(result?.additionalUserInfo.user.uid, result?.additionalUserInfo.user.displayName, result?.additionalUserInfo.user.email).then((success) => {
          if(success) {
            this._router.navigateByUrl(this.signUpRedirectUrl);
          }
        });
      } else {
        this._router.navigateByUrl(this.signInRedirectUrl);
      }
      
      // ...
    })
    .catch((error) => {
      logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_BROWSER_FACEBOOK_USER,  { 
        LC_error: error,
        LC_errorCode: error?.code,
        LC_errorMessage: error?.message
      });
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      // ...
    });
  }

  async signOut(): Promise<void> {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_OUT_USER,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    if (this._platform.is("capacitor")) {
      try {
        await this._facebook.logout(); // Unauth with Facebook
        await this._auth.signOut(); // Unauth with Firebase
        this._currentAuthUser = null;
        this._accountsService.unLoadAccounts();
      } catch (error) {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_OUT_USER,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        console.log(error);
      }
    } else {
      try {
        await this._auth.signOut();
        this._currentAuthUser = null;
        this._accountsService.unLoadAccounts();
      } catch (error) {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_OUT_USER,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        console.log(error);
      }
    }
  }

  signInUser(email: string, password: string, rememberMe: boolean) {
    
    
    if(rememberMe) {
      var persistence = browserLocalPersistence;
    } else {
      var persistence = browserSessionPersistence;
    }

    const promise = new Promise((resolve, reject) => {
      try {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_USER,  { 
          LC_currentAuthUser: email,
          LC_versionNumber: LociConstants.VERSION_NUMBER
        });
      } catch (error) {
        reject(error)
      }
      setPersistence(this._auth, persistence)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        signInWithEmailAndPassword(this._auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          resolve(true);
        })
        .catch((error) => {
          logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_USER,  { 
            LC_error: error,
            LC_errorCode: error?.code,
            LC_errorMessage: error?.message
          });
          var errorCode = error.code;
          var errorMessage = error.message;
          reject(errorMessage);
        });
      })
      .catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_USER,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
      
    });
    return promise;
  }

  passwordResetSignInWithLink(email)  {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK_PASSWORD_RESET,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user",
      LC_email: email
    });
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/change-password-final?email=${email}`,
      handleCodeInApp: true
    };
    return this.signInUserWithLink(email, actionCodeSettings);
  }

  emailResetSignInWithLink() {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK_EMAIL_RESET,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    var email = this._auth.currentUser?.email || '';
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/change-email-final?email=${email}`,
      handleCodeInApp: true
    };
    
    return this.signInUserWithLink(email, actionCodeSettings);
  }

  deleteAccountSignInWithLink() {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK_DELETE_ACCOUNT,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    var email = this._auth.currentUser?.email || '';
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/delete-account-final?email=${email}`,
      handleCodeInApp: true
    };
    return this.signInUserWithLink(email, actionCodeSettings);
  }
  
  signInUserWithLink(email: string, actionCodeSettings: ActionCodeSettings) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    const promise = new Promise((resolve, reject) => {
      fetchSignInMethodsForEmail(this._auth, email.trim()).then((signInMethods) => {
        if(signInMethods?.length > 0) {
          sendSignInLinkToEmail(this._auth, email.trim(), actionCodeSettings)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_WITH_LINK,  { 
              LC_error: error,
              LC_errorCode: error?.code,
              LC_errorMessage: error?.message
            });
            var errorCode = error.code;
            var errorMessage = error.message;
            reject(errorMessage);
          });
        } else {
          reject("unknown user");
        }
      }).catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_WITH_LINK,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
      
    });
    return promise;
  }

  signInWithEmailLink(email) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_EMAIL_LINK,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user"
    });
    const promise = new Promise((resolve, reject) => {
      signInWithEmailLink(this._auth, email)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_WITH_EMAIL_LINK,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
    });
    return promise;
  }

  signUpUser(username: string, email: string, password: string) {
    logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_UP_USER,  { 
      LC_currentAuthUser: this._auth.currentUser?.displayName ?? "no signed in user",
      LC_username: username,
      LC_email: email
    });
    var actionCodeSettings = {
      url: this._config.appUiBaseUrl,
    };

    const promise = new Promise<string>((resolve, reject) => {
      createUserWithEmailAndPassword(this._auth, email, password)
      .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        updateProfile(this._currentAuthUser as User, {
          displayName: username
        }).then((x) => {
          this._accountsService.createAccount(userCredential.user.uid, username, email).then((customer) => {
            if(customer) {
              this._accountsService.preloadConsumerProfile(this._auth.currentUser);
              this._router.navigateByUrl(this.signUpRedirectUrl);
            }
          });
          resolve(user.uid);
        }).catch((error) => {
          logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_UP_USER,  { 
            LC_error: error,
            LC_errorCode: error?.code,
            LC_errorMessage: error?.message
          });
          reject(error.message);
        });

        sendEmailVerification(this._currentAuthUser as User, actionCodeSettings).then(function() {
          // Email sent.
        }).catch((error) => {
          logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_UP_USER_SEND_EMAIL_VERIFCIATION,  { 
            LC_error: error,
            LC_errorCode: error?.code,
            LC_errorMessage: error?.message
          });
        });
      })
      .catch((error) => {
        logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_UP_USER,  { 
          LC_error: error,
          LC_errorCode: error?.code,
          LC_errorMessage: error?.message
        });
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(error.message);
      });
    });
    return promise;
  }

  async prime() {
    // the purpose of this method is to make sure this service spins up early 
  }

  public isAuthenticated(): Promise<boolean | UrlTree> {
    const promise = new Promise<boolean | UrlTree>((resolve, reject) => {
      this._firebaseHasloadedSubject.subscribe((hasLoaded) => {
        if(hasLoaded) {
          if(this._auth.currentUser) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
    return promise;
    
  }

  public getToken() {
    return this._firebaseAuthToken;
  }
  
}
