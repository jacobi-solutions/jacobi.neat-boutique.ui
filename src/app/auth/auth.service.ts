import { Injectable } from '@angular/core';
import {
	Auth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  fetchSignInMethodsForEmail,
  signInWithEmailLink,
  updatePassword,
  verifyBeforeUpdateEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithRedirect,
  signInWithCredential,
  getAdditionalUserInfo,
  User,
	signOut
} from '@angular/fire/auth';
import { ActionCodeSettings, FacebookAuthProvider } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { AccountsService } from '../services/accounts.service';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { Router, UrlTree } from '@angular/router';

import {
  SignInWithApple,
  SignInWithAppleResponse,
  SignInWithAppleOptions,
} from '@capacitor-community/apple-sign-in';

export class AccountDeletion {
  userId: string | undefined;
  token: string;
}

@Injectable({
	providedIn: 'root'
})
export class AuthService {
  private _firebaseHasloadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _firebaseAuthToken: string;
  private _currentAuthUser: User;
	constructor(private _auth: Auth, private _accountsService: AccountsService, private _platform: Platform,
    private _facebook: Facebook, private _router: Router) {

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

	async signUpUser(username: string, email: string, password: string) {
    // todo-now add username
		try {
			const user = await createUserWithEmailAndPassword(this._auth, email, password);
			return user;
		} catch (e) {
			return null;
		}
	}

	async signInUser(email: string, password: string, rememberMe: boolean) {
		try {
			const user = await signInWithEmailAndPassword(this._auth, email, password);
			return user;
		} catch (e) {
			return null;
		}
	}

  signInUserWithFacebook(): void {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_FACEBOOK_USER,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    console.log("facebook auth");
    if (this._platform.is("capacitor")) {
      this.nativeFacebookAuth();
    } else {
      this.browserFacebookAuth();
    }
  }
  async nativeFacebookAuth(): Promise<void> {
    try {
      // logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
      //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
      //   LC_version_number: LociConstants.VERSION_NUMBER
      // });
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
                      this._router.navigateByUrl(environment.signUpRedirectUrl);
                    }
                  });
                } else {
                  this._router.navigateByUrl(environment.signInRedirectUrl);
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
      // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_NATIVE_FACEBOOK_USER,  { 
      //   LC_error: error,
      //   LC_errorCode: error?.code,
      //   LC_errorMessage: error?.message,
      //   LC_version_number: LociConstants.VERSION_NUMBER
      // });
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
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_BROWSWER_FACEBOOK_USER,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    
    console.log("browser facebook auth");
    var provider = new FacebookAuthProvider();
    
    signInWithRedirect(this._auth, provider)
    .then((result: any) => {
      console.log("sign-in-with-facebook-redirect");
      if(result?.additionalUserInfo?.isNewUser) {
        this._accountsService.createAccount(result?.additionalUserInfo.user.uid, result?.additionalUserInfo.user.displayName, result?.additionalUserInfo.user.email).then((success) => {
          if(success) {
            this._router.navigateByUrl(environment.signUpRedirectUrl);
          }
        });
      } else {
        this._router.navigateByUrl(environment.signInRedirectUrl);
      }
      
      // ...
    })
    .catch((error) => {
      // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_BROWSER_FACEBOOK_USER,  { 
      //   LC_error: error,
      //   LC_errorCode: error?.code,
      //   LC_errorMessage: error?.message,
      //   LC_version_number: LociConstants.VERSION_NUMBER
      // });
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

  async signInUserWithApple() {

  }

  deleteAccountSignInWithLink() {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK_DELETE_ACCOUNT,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    var email = this._auth?.currentUser?.email || '';
    var actionCodeSettings = {
      url: `${environment.lociUIBaseUrl}/auth-flow/delete-account-final?email=${email}`,
      handleCodeInApp: true
    };
    return this.signInUserWithLink(email, actionCodeSettings);
  }

  deleteAccountInit() {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_DELETE_ACCOUNT_INIT,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    var userId = this._auth?.currentUser?.uid;
    var accountDeletion = new AccountDeletion();
    accountDeletion.token = this._uniqueStr(32);
    accountDeletion.userId = userId;
    this._accountsService.deleteAuthUserInit(accountDeletion);
    return accountDeletion;
  }

  deleteAccountFinal(accountDeletion: AccountDeletion|null) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_DELETE_ACCOUNT_FINAL,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    this._accountsService.deleteAuthUserInit(accountDeletion);
    
    const promise = new Promise<void>((resolve, reject) => {
      this._auth?.currentUser?.delete().then(() => {
        this._accountsService.deleteAuthUserFinal(accountDeletion);
        resolve();
      }).catch((error) => {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_DELETE_ACCOUNT_FINAL,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        this.deleteAccountRollback(accountDeletion);
        reject();
      });
    });
    return promise;
  }

  deleteAccountRollback(accountDeletion: AccountDeletion|null) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_DELETE_USER_ACCOUNT_ROLLBACK,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    this._accountsService.deleteAccountRollBack(accountDeletion);
  }

  passwordResetSignInWithLink(email)  {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK_PASSWORD_RESET,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_email: email,
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    var actionCodeSettings = {
      url: `${environment.lociUIBaseUrl}/auth-flow/change-password-final?email=${email}`,
      handleCodeInApp: true
    };
    return this.signInUserWithLink(email, actionCodeSettings);
  }

  resetPassword(password: string) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_RESET_PASSWORD,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    const promise = new Promise((resolve, reject) => {
      updatePassword(this._auth?.currentUser, password).then(() => {
        resolve(true);
      }).catch((error) => {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_RESET_PASSWORD,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        var test = error;
      });
    });
    return promise;
  }

  emailResetSignInWithLink() {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK_EMAIL_RESET,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    var email = this._auth?.currentUser?.email || '';
    var actionCodeSettings = {
      url: `${environment.lociUIBaseUrl}/auth-flow/change-email-final?email=${email}`,
      handleCodeInApp: true
    };
    
    return this.signInUserWithLink(email, actionCodeSettings);
  }

  changeEmail(email: string) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_newEmail: email,
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    var actionCodeSettings = {
      url: `${environment.lociUIBaseUrl}/auth-flow/sign-in`,
      handleCodeInApp: true
    };
    const promise = new Promise((resolve, reject) => {
      verifyBeforeUpdateEmail(this._auth?.currentUser, email, actionCodeSettings).then(() => {
        resolve(true);
      }).catch((error) => {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_CHANGE_EMAIL,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        // console.log(error)
      });
    });
    return promise;
  }

  public changeUsername(username: string) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_newUsername: username,
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    updateProfile(this._currentAuthUser as User, {
      displayName: username
    }).then(() => {
      this._auth?.currentUser?.getIdToken(true)
      this._accountsService.updateUsername(username);
    }).catch((error) => {
      // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_CHANGE_USERNAME,  { 
      //   LC_error: error,
      //   LC_errorCode: error?.code,
      //   LC_errorMessage: error?.message,
      //   LC_version_number: LociConstants.VERSION_NUMBER
      // });
    });
  }

  public changePhotoURL(photoUrl: string) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_CHANGE_USERNAME,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_newPhotoUrl: photoUrl
    // });
    const promise = new Promise((resolve, reject) => {
      updateProfile(this._currentAuthUser as User, {
        photoURL: photoUrl
      })
      .then(() => {
        this._auth?.currentUser?.getIdToken(true)
      }).catch((error) => {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_CHANGE_PHOTO_URL,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        reject(error);
      });
    });
    return promise;
  }

  signInWithEmailLink(email) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_EMAIL_LINK,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    const promise = new Promise((resolve, reject) => {
      signInWithEmailLink(this._auth, email)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_WITH_EMAIL_LINK,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
    });
    return promise;
  }

  signInUserWithLink(email: string, actionCodeSettings: ActionCodeSettings) {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_IN_WITH_LINK,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    const promise = new Promise((resolve, reject) => {
      fetchSignInMethodsForEmail(this._auth, email.trim()).then((signInMethods) => {
        if(signInMethods?.length > 0) {
          sendSignInLinkToEmail(this._auth, email.trim(), actionCodeSettings)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_WITH_LINK,  { 
            //   LC_error: error,
            //   LC_errorCode: error?.code,
            //   LC_errorMessage: error?.message,
            //   LC_version_number: LociConstants.VERSION_NUMBER
            // });
            var errorCode = error.code;
            var errorMessage = error.message;
            reject(errorMessage);
          });
        } else {
          reject("unknown user");
        }
      }).catch((error) => {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_IN_WITH_LINK,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        var errorCode = error.code;
        var errorMessage = error.message;
        reject(errorMessage);
      });
      
    });
    return promise;
  }
  
  getEmail() {
    return this._auth?.currentUser?.email;
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

	async signOut(): Promise<void> {
    // logEvent(this._analytics, FirebaseEventTypes.AUTH_SIGN_OUT_USER,  { 
    //   LC_currentAuthUser: this._auth?.currentUser?.displayName ?? "no signed in user",
    //   LC_version_number: LociConstants.VERSION_NUMBER
    // });
    if (this._platform.is("capacitor")) {
      try {
        // await this._facebook.logout(); // Unauth with Facebook
        await this._auth.signOut(); // Unauth with Firebase
        this._currentAuthUser = null;
        this._accountsService.unLoadAccounts();
      } catch (error) {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_OUT_USER,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        console.log(error);
      }
    } else {
      try {
        await this._auth.signOut();
        this._currentAuthUser = null;
        this._accountsService.unLoadAccounts();
      } catch (error) {
        // logEvent(this._analytics, FirebaseEventTypes.AUTH_ERROR_SIGN_OUT_USER,  { 
        //   LC_error: error,
        //   LC_errorCode: error?.code,
        //   LC_errorMessage: error?.message,
        //   LC_version_number: LociConstants.VERSION_NUMBER
        // });
        console.log(error);
      }
    }
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