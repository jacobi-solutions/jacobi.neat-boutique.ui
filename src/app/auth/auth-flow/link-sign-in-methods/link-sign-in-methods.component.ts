import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Validators, ValidatorFn, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { passwordConfirmMustMatchValidator } from '../password-confirm-must-match.directive';
import { AccountsService } from 'src/app/services/accounts.service';
import { environment } from 'src/environments/environment';
import { EmailAuthProvider, OAuthProvider, FacebookAuthProvider } from 'firebase/auth';

@Component({
  selector: 'jacobi-link-sign-in-methods',
  templateUrl: './link-sign-in-methods.component.html',
  styleUrls: ['../auth-flow.page.scss', './link-sign-in-methods.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LinkSignInMethodsComponent implements OnInit {

  public isSuccess = false;
  public successMessage: string;
  public isFailure = false;
  public failureMessage: string;
  public maxUsernameLength = 15;
  public minUsernameLength = 3;
  public minPasswordLength = 8;
  public passwordInputType: string;
  public passwordEyeIcon: string;
  public legalLinks?: { privacyPolicy: string, termsAndConditions: string };
  public splitScreenBgImage?: string;
  public hasFacebookButton?: boolean;
  public hasAppleButton?: boolean;
  public hasEmailAndPassword?: boolean;

  private _showPassword = false;

  public registerForm = new FormGroup({
    // username: new FormControl('', [ Validators.required, Validators.minLength(this.minUsernameLength), Validators.maxLength(this.maxUsernameLength) ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(this.minPasswordLength) ]),
    passwordConfirm: new FormControl('', Validators.required)
  },
  {
    validators: <ValidatorFn>passwordConfirmMustMatchValidator
  }
);

  constructor(private _router: Router, private _modalCtrl: ModalController, private _authService: AuthService,
    private _platform: Platform) {
      
    this.passwordInputType = 'password';
    this.passwordEyeIcon = 'eye-off-outline';
    this.legalLinks = { privacyPolicy: '/legal/privacy-policy', termsAndConditions: '/legal/terms-of-service' },
    this.splitScreenBgImage = environment.splitScreenOptions?.images?.signIn;
    
    this._loadAvailableProvidersToLinkTo();
    
    
  }

  async _loadAvailableProvidersToLinkTo() {
    var providers = await this._authService.getAvailableSignInMethodsToLinkTo();
    if(!providers.includes(EmailAuthProvider.PROVIDER_ID)) {
      this.hasEmailAndPassword = true;
    } 
    if (!providers.includes((new OAuthProvider('apple.com')).providerId)) {
      this.hasAppleButton = true;
    } 
    if(!providers.includes(FacebookAuthProvider.PROVIDER_ID)) {
      this.hasFacebookButton = true;
    }
  }

  ngOnInit() {
    
  }


  dismiss() {
    this._router.navigateByUrl(environment.unauthenticatedRedirect);
  }

  linkToFacebook() {
    this._authService.linkUserToFacebookSignInMethod();
  }

  linkToApple() {
    this._authService.linkUserToAppleSignInMethod();
  }

  linkToEmailAndPassword() {
    this._authService.linkUserToEmailAndPasswordSignInMethod(this.registerForm.controls.email.value, this.registerForm.controls.password.value);
  }

  goToLegal() {

  }

  resetResponse() {
    this.isSuccess = false;
    this.isFailure = false;
  }

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
      this.passwordEyeIcon = 'eye-outline';
      this.passwordInputType = 'text';
    } else {
      this.passwordEyeIcon = 'eye-off-outline';
      this.passwordInputType = 'password';
    }
  }

}
