import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from '../../auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'jacobi-change-password-init',
  templateUrl: './change-password-init.component.html',
  styleUrls: ['../auth-flow.page.scss', './change-password-init.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangePasswordInitComponent implements OnInit {

  public isSuccess = false;
  public successMessage: string;
  public isFailure = false;
  public failureMessage: string;
  public registerUsernameMaxLength = 15;
  public splitScreenBgImage?: string;

  public forgotPasswordForm = new FormGroup({
    email: new FormControl('', [ Validators.required, Validators.email ])
  });
  
  constructor(private _router: Router, private _authService: AuthService,
    // private customerService: AccountsService
    ) {
      //this.splitScreenBgImage = this._authService?.splitScreenOptions?.images?.resetPasswordInit;
    }

  ngOnInit() {
    
  }

  sendPasswordResetLink() {
    this.resetReponse();

    this._authService.passwordResetSignInWithLink(this.forgotPasswordForm.controls.email.value).then(() => {
      this.setIsSuccess(`If we find ${this.forgotPasswordForm.controls.email.value} in our system, we will send a password reset email to that address.  Click on the sign in link provided in the email and you'll be routed to the password reset page.`);
    })
    .catch(() => {
      this.setIsFailure(`We could not find ${this.forgotPasswordForm.controls.email.value} in our system.`);
    });

    // this.customerService
    // .sendResetPasswordLink(this.forgotPasswordForm.controls.email.value)
    // .then(() => {
    //   this.setIsSuccess(`An email has been sent to ${this.forgotPasswordForm.controls.email.value} with password reset instructions.`);
    // })
    // .catch(() => {
    //   this.setIsFailure(`We could not find ${this.forgotPasswordForm.controls.email.value} in our system.`);
    // });
  }

  setIsLoggingIn(){}

  resetReponse() {
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
  
dismiss() {
  this._router.navigateByUrl(environment.unauthenticatedRedirect);
}  

}
