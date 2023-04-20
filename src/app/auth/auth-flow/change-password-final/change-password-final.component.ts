import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthPageButtons, AuthService } from '../../auth.service';
import { passwordConfirmMustMatchValidator } from '../password-confirm-must-match.directive';

@Component({
  selector: 'jacobi-change-password-final',
  templateUrl: './change-password-final.component.html',
  styleUrls: ['../auth-flow.page.scss', './change-password-final.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordFinalComponent implements OnInit {

  public isSuccess = false;
  public successMessage: string;
  public isFailure = false;
  public failureMessage: string;
  public passwordInputType: string;
  public passwordEyeIcon: string;
  public minPasswordLength = 8;
  public resetPasswordId: string;
  public resetPasswordToken: string;
  public canResetPassword: boolean;
  public splitScreenBgImage?: string;

  public resetPasswordForm = new FormGroup({
      password: new FormControl('', [ Validators.required, Validators.minLength(8) ]),
      passwordConfirm: new FormControl('', Validators.required)
    },
    {
      validators: passwordConfirmMustMatchValidator
    }
  );

  private _showPassword = false;

  
  constructor(private _authService: AuthService, private _router: Router, private _activatedRoute: ActivatedRoute) { 
    this.passwordInputType = 'password';
    this.passwordEyeIcon = 'eye-off-outline';
    this.splitScreenBgImage = this._authService?.splitScreenOptions?.images?.resetPasswordFinal;
    
    this._activatedRoute.queryParams.subscribe(params => {
      var resetPasswordEmail = params['email'];

      if(resetPasswordEmail) {
        this.signInWithEmailLink(resetPasswordEmail);
      }
      
      // this.resetPasswordId = params['change-password-id'];
      // this.resetPasswordToken = params['change-password-token'];
    });
  }

  ngOnInit() {
    
  }

  signInWithEmailLink(email: string) {
    this._authService.signInWithEmailLink(email).then(() => {
      this.canResetPassword = true;
    }).catch(() => {
      this.setIsFailure(`Please try again.`);
    });
    
  }

  resetPassword(): void {
    if(this.resetPasswordForm.controls.password.value !== this.resetPasswordForm.controls.passwordConfirm.value) {
      this.isSuccess = false;
      this.isFailure = true;
      this.setIsFailure(`Please try again.`);
      // console.log('if fail');
      
      return;
    }

    this.resetResponse;
    this._authService.resetPassword(this.resetPasswordForm.controls.password.value).then(() => {
      this.setIsSuccess(`Your password has been reset, please <a href='/auth-flow/sign-in' class="clickable">sign in</a> to continue.`);
    })
    .catch(() => {
      // console.log('catch fail');
      
      this.setIsFailure(`Please try again.`);
    });
  }

  setIsForgotPassword(){
    this.goToPage('/auth-flow/change-password-init');
  }

  setIsLoggingIn(){}

  dismiss() {
    this._router.navigateByUrl(this._authService.unauthenticatedRedirect);
  }

  resetResponse() {
    this.isSuccess = false;
    this.isFailure = false;
  }

  setIsSuccess(successMessage: string) {
    this.isSuccess = true;
    this.isFailure = false;
    this.successMessage = successMessage;
  }

  setIsFailure(failureMessage: string) {
    this.isSuccess = false;
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

  goToPage(page: string) {
    this._router.navigateByUrl(page);
  }

}
