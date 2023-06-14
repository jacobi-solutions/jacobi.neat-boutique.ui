import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Validators, ValidatorFn, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { AuthService } from '../../auth.service';
import { passwordConfirmMustMatchValidator } from '../password-confirm-must-match.directive';
import { AccountsService } from 'src/app/services/accounts.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'jacobi-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../auth-flow.page.scss', './sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignUpComponent implements OnInit {

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

  private _showPassword = false;

  public registerForm = new FormGroup({
    username: new FormControl('', [ Validators.required, Validators.minLength(this.minUsernameLength), Validators.maxLength(this.maxUsernameLength) ]),
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
    this.hasFacebookButton = environment.production;
    this.legalLinks = { privacyPolicy: '/legal/privacy-policy', termsAndConditions: '/legal/terms-of-service' },
    this.splitScreenBgImage = environment.splitScreenOptions?.images?.signIn;

    this.hasAppleButton = environment.production;
    
  }

  ngOnInit() {
    
  }


  dismiss() {
    this._router.navigateByUrl(environment.unauthenticatedRedirect);
  }

  signUpWithFacebook() {
    this._authService.signInUserWithFacebook();
  }

  signUpWithApple() {
    this._authService.signInUserWithApple();
  }

  signUp() {
    this._authService.signUpUser(this.registerForm.controls.username.value, this.registerForm.controls.email.value, this.registerForm.controls.password.value).then(() => {
      this.setIsSuccess(`Thank you for signing up. A confirmation email has been sent to ${this.registerForm.controls.email.value} with instructions.`);
      
      
      this._router.navigateByUrl(environment.signUpRedirectUrl);
    }).catch((errorMessage: string) => {
      this.setIsFailure(errorMessage);
    });
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
