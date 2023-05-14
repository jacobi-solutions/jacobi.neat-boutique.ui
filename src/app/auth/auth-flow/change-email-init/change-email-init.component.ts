import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AccountsService } from 'src/app/services/accounts.service';
import { AuthService } from '../../auth.service';
import { passwordConfirmMustMatchValidator } from '../password-confirm-must-match.directive';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'jacobi-change-email-init',
  templateUrl: './change-email-init.component.html',
  styleUrls: ['../auth-flow.page.scss', './change-email-init.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangeEmailInitComponent implements OnInit {
    
  public isSuccess = false;
  public successMessage: string;
  public isFailure = false;
  public failureMessage: string;
  public splitScreenBgImage?: string;

  
  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _authService: AuthService) { 
    // this.splitScreenBgImage = this._authService?.splitScreenOptions?.images?.resetPasswordInit;

    this._activatedRoute.queryParams.subscribe(params => {


      this.isSuccess = params['success'] || null;
      if(this.isSuccess != null && this.isSuccess === true) {
        this.setIsSuccess("Your email has been changed.  Please sign in with your new email address.");
      } else if (this.isSuccess != null && this.isSuccess === false) {
        this.setIsFailure("There was a problem changing your email. Please try again.");
      }
    });
  }

 ngOnInit() {
  
 }

 initChangeEmailRequest() {
  this._authService.emailResetSignInWithLink().then(() => {
    this.setIsSuccess(`An email has been sent to ${this._authService.getEmail()}.  Click the sign in link in the email to start the process`);
    // this.authService.revokeToken();
  }).catch((err) => {
    this.setIsFailure("There was a problem changing your email. Please try again.");

  });
    // this.customerService.initChangeEmailRequest(this.changeEmailForm.controls.newEmail.value).then(() => {
    //   this.setIsSuccess(`An email has been sent to ${this.changeEmailForm.controls.newEmail.value} to verify that you own it.`);
    //   // this.authService.revokeToken();
    // }).catch(() => {
    //   this.setIsFailure("There was a problem changing your email. Please try again.");
    // });
  }

  setIsForgotPassword(){
    this.goToPage('/auth-flow/forgot-password');
  }

  setIsLoggingIn(){}

  dismiss() {
    this._router.navigateByUrl(environment.unauthenticatedRedirect);
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

  goToPage(page: string) {
    this._router.navigateByUrl(page);
  }
}
