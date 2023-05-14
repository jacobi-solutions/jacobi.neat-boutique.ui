import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation, Input, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'jacobi-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['../auth-flow.page.scss', './sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent implements OnInit {
  
  public isSuccess = false;
  public successMessage: string;
  public isFailure = false;
  public failureMessage: string;
  public registerUsernameMaxLength = 15;
  public minPasswordLength = 8;
  public passwordInputType: string;
  public passwordEyeIcon: string;
  public rememberMe = true;
  public hasFacebookButton: boolean;
  public hasAppleButton: boolean;
  public legalLinks?: { privacyPolicy: string, termsAndConditions: string };
  public splitScreenBgImage?: string;

  public loginForm = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
  });

  private _showPassword = false;
  
  constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _authService: AuthService,
    private _platform: Platform) {
    this.passwordInputType = 'password';
    this.passwordEyeIcon = 'eye-off-outline';
    this.hasFacebookButton = environment.production;
    this.legalLinks = { privacyPolicy: '/legal/privacy-policy', termsAndConditions: '/legal/terms-of-service' },
    this.splitScreenBgImage = environment.splitScreenOptions?.images?.signIn;

    if (!this._platform.is('android')){
      this.hasAppleButton = environment.production;
    }
  }

  ngOnInit() {
    
  }

  signInWithFacebook() {
    this._authService.signInUserWithFacebook();
  }

  signInWithApple() {
    this._authService.signInUserWithApple();
  }

  signIn() {
    
    
    // this.resetResponse();
    this.isSuccess = false;
    this.isFailure = false;
   
    this._authService.signInUser(this.loginForm.controls.email.value, this.loginForm.controls.password.value, this.rememberMe).then(() => {
      this._router.navigateByUrl(environment.signInRedirectUrl);
      // this.dismiss();
    }).catch(() => {
      this.setIsFailure(`We didn't find matching credentials.  Check for typos and try again.`);
    });
  }

  dismiss() {
    this._router.navigateByUrl(environment.unauthenticatedRedirect);
  }

  goToLegal() {

  }

  // resetResponse() {
  //   this.isSuccess = false;
  //   this.isFailure = false;
  // }

  setIsSuccess(successMessage: string) {
    this.isSuccess = true;
    this.successMessage = successMessage;
  }

  setIsFailure(failureMessage: string) {
    this.isFailure = true;
    this.failureMessage = failureMessage;
  }

  onTogglePasswordHide() {
    this._showPassword = !this._showPassword;
    if(this._showPassword) {
      this.passwordEyeIcon = 'eye';
      this.passwordInputType = 'text';
    } else {
      this.passwordEyeIcon = 'eye-off-outline';
      this.passwordInputType = 'password';
    }
  }

}
