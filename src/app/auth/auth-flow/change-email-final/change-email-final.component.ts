import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AccountsService } from 'src/app/services/accounts.service';
import { AuthPageButtons, AuthService } from '../../auth.service';

@Component({
  selector: 'jacobi-change-email-final',
  templateUrl: './change-email-final.component.html',
  styleUrls: ['../auth-flow.page.scss', './change-email-final.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangeEmailFinalComponent implements OnInit {
    
  public isSuccess = false;
  public successMessage: string;
  public isFailure = false;
  public failureMessage: string;
  public canResetEmail = false;
  public splitScreenBgImage?: string;

  public changeEmailForm: FormGroup = new FormGroup({
    // currentEmail: new FormControl('', [ Validators.required, Validators.email ]),
    newEmail: new FormControl('', [Validators.required, Validators.email])
  });
  
  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _authService: AuthService) { 
    this.splitScreenBgImage = this._authService?.splitScreenOptions?.images?.changeEmailFinal;

    this._activatedRoute.queryParams.subscribe(params => {
      var resetEmailAddressEmail = params['email'];

      if(resetEmailAddressEmail) {
        this.signInWithEmailLink(resetEmailAddressEmail);
      }
    });
  }

 ngOnInit() {
  
 }

 signInWithEmailLink(email: string) {
  this._authService.signInWithEmailLink(email).then(() => {
    this.canResetEmail = true;
  }).catch(() => {
    this.setIsFailure(`Please try again.`);
  });
  
}

 changeEmail() {
  console.log("change-email method called");
  this._authService.changeEmail(this.changeEmailForm.controls.newEmail.value).then(() => {
    this.setIsSuccess(`An email has been sent to ${this.changeEmailForm.controls.newEmail.value} to verify that you own it.`);
    // this.authService.revokeToken();
  }).catch(() => {
    this.setIsFailure("There was a problem changing your email. Please try again.");
  });
    // this.customerService.initChangeEmailRequest(this.changeEmailForm.controls.newEmail.value).then(() => {
    //   this.setIsSuccess(`An email has been sent to ${this.changeEmailForm.controls.newEmail.value} to verify that you own it.`);
    //   // this.authService.revokeToken();
    // }).catch(() => {
    //   this.setIsFailure("There was a problem changing your email. Please try again.");
    // });
  }

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

  private _goToPage(page: string) {
    this._router.navigateByUrl(page);
  }
}
