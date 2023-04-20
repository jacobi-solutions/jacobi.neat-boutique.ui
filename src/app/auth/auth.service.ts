import { Injectable, TemplateRef } from '@angular/core';
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

import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';
import { AuthSplitScreenVersionConfig, AuthConfig } from './auth.config';
import { AccountsService } from '../services/accounts.service';
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

  // auth page buttons
  // public authPageButtonsSubject: BehaviorSubject<AuthPageButtons> = new BehaviorSubject<AuthPageButtons>(null);

  



  constructor(private _router: Router, private _config: AuthConfig, private _platform: Platform,
      private _facebook: Facebook, private _accountsService: AccountsService) {

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
        
        console.log("facebook redirect");
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = credential.user.refreshToken;
        var additionalUserInfo = getAdditionalUserInfo(credential);
        if(additionalUserInfo?.isNewUser) {
          this._accountsService.createAccount(credential.user.uid, credential.user.displayName, credential.user.email).then((customer) => {
            if(customer) {
              this._router.navigateByUrl(this.signUpRedirectUrl);
            }
          });
          
        } else {
          this._router.navigateByUrl(this.signInRedirectUrl);
        }
        // ...
      }
    }).catch((error) => {
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
    
      updateProfile(this._currentAuthUser as User, {
        displayName: username
      }).then(() => {
        this._auth.currentUser?.getIdToken(true)
        this._accountsService.updateUsername(username);
      }).catch((error) => {
       
      });
    
    
  }
  
  public changePhotoURL(photoUrl: string) {
    const promise = new Promise((resolve, reject) => {
      updateProfile(this._currentAuthUser as User, {
        photoURL: photoUrl
      })
      .then(() => {
        this._auth.currentUser?.getIdToken(true)
      }).catch((error) => {
        reject(error);
      });
    });
    return promise;
  }

  changeEmail(email: string) {
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/sign-in`,
      handleCodeInApp: true
    };
    const promise = new Promise((resolve, reject) => {
      verifyBeforeUpdateEmail(this._currentAuthUser as User, email, actionCodeSettings).then(() => {
        resolve(true);
      }).catch((error) => {
        // console.log(error)
      });
    });
    return promise;
  }

  deleteAccountInit() {
    var userId = this._auth.currentUser?.uid;
    var accountDeletion = new AccountDeletion();
    accountDeletion.token = this._uniqueStr(32);
    accountDeletion.userId = userId;
    this._accountsService.deleteAuthUserInit(accountDeletion);
    return accountDeletion;
  }

  deleteAccountFinal(accountDeletion: AccountDeletion|null) {
    this._accountsService.deleteAuthUserInit(accountDeletion);
    
    const promise = new Promise<void>((resolve, reject) => {
      this._auth.currentUser?.delete().then(() => {
        this._accountsService.deleteAuthUserFinal(accountDeletion);
        resolve();
      }).catch((error) => {
        this.deleteAccountRollback(accountDeletion);
        reject();
      });
    });
    return promise;
  }

  deleteAccountRollback(accountDeletion: AccountDeletion|null) {
    this._accountsService.deleteAccountRollBack(accountDeletion);
  }

  resetPassword(password: string) {
    const promise = new Promise((resolve, reject) => {
      updatePassword(this._currentAuthUser as User, password).then(() => {
        resolve(true);
      }).catch((error) => {
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
  
  async _createFirebaseuserFromApple(identityToken, givenName, familyName, rawNonce) {
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
      console.log(error);
    });
  }

  signInUserWithApple() {
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
          await this._createFirebaseuserFromApple(res.response.identityToken, res.response.givenName, res.response.familyName, rawNonce);
        })
        .catch(error => {
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
          // Handle error
        });
    }
  }

  signInUserWithFacebook(): void {
    console.log("facebook auth");
    if (this._platform.is("capacitor")) {
      this.nativeFacebookAuth();
    } else {
      this.browserFacebookAuth();
    }
  }
  async nativeFacebookAuth(): Promise<void> {
    try {
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
      
      
    } catch (err) {
      console.log(err);
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
    if (this._platform.is("capacitor")) {
      try {
        await this._facebook.logout(); // Unauth with Facebook
        await this._auth.signOut(); // Unauth with Firebase
        this._currentAuthUser = null;
        this._accountsService.unLoadAccounts();
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await this._auth.signOut();
        this._currentAuthUser = null;
        this._accountsService.unLoadAccounts();
      } catch (err) {
        console.log(err);
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
          var errorCode = error.code;
          var errorMessage = error.message;
          reject(errorMessage);
        });
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
      
    });
    return promise;
  }

  passwordResetSignInWithLink(email)  {
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/change-password-final?email=${email}`,
      handleCodeInApp: true
    };
    return this.signInUserWithLink(email, actionCodeSettings);
  }

  emailResetSignInWithLink() {
    var email = this._auth.currentUser?.email || '';
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/change-email-final?email=${email}`,
      handleCodeInApp: true
    };
    
    return this.signInUserWithLink(email, actionCodeSettings);
  }

  deleteAccountSignInWithLink() {
    var email = this._auth.currentUser?.email || '';
    var actionCodeSettings = {
      url: `${this._config.appUiBaseUrl}/auth-flow/delete-account-final?email=${email}`,
      handleCodeInApp: true
    };
    return this.signInUserWithLink(email, actionCodeSettings);
  }
  
  signInUserWithLink(email: string, actionCodeSettings: ActionCodeSettings) {
    const promise = new Promise((resolve, reject) => {
      fetchSignInMethodsForEmail(this._auth, email).then((signInMethods) => {
        if(signInMethods?.length > 0) {
          sendSignInLinkToEmail(this._auth, email, actionCodeSettings)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            reject(errorMessage);
          });
        } else {
          reject("unknown user");
        }
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
      
    });
    return promise;
  }

  signInWithEmailLink(email) {
    const promise = new Promise((resolve, reject) => {
      signInWithEmailLink(this._auth, email)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
    });
    return promise;
  }

  signUpUser(username: string, email: string, password: string) {
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
          reject(error.message);
        });

        sendEmailVerification(this._currentAuthUser as User, actionCodeSettings).then(function() {
          // Email sent.
        }).catch((error) => {
          
        });
      })
      .catch((error) => {
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
