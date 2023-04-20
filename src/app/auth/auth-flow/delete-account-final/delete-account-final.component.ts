import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AccountsService } from 'src/app/services/accounts.service';
import { AccountDeletion, AuthPageButtons, AuthService } from '../../auth.service';

@Component({
  selector: 'jacobi-delete-account-final',
  templateUrl: './delete-account-final.component.html',
  styleUrls: ['../auth-flow.page.scss', './delete-account-final.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeleteAccountFinalComponent implements OnInit {
    
  public isSuccess = false;
  public successMessage: string;
  public isFailure = false;
  public failureMessage: string;
  public canResetEmail = false;
  public splitScreenBgImage?: string;
  public accountDeletion: AccountDeletion | null = null;
  public deleteButtonText: string;
  public cancelButtonText: string;
  public deletePromptText: string;
  public 

  public changeEmailForm: FormGroup = new FormGroup({
    // currentEmail: new FormControl('', [ Validators.required, Validators.email ]),
    newEmail: new FormControl('', [Validators.required, Validators.email])
  });
  
  constructor(private _router: Router, private _activatedRoute: ActivatedRoute, private _authService: AuthService) { 
    // this.splitScreenBgImage = this._authService?.splitScreenOptions?.images?.changeEmailFinal;

    this.resetDeletion(); 

    this._activatedRoute.queryParams.subscribe(params => {
      var resetEmailAddressEmail = params['email'];

      if(resetEmailAddressEmail) {
        this._signInWithEmailLink(resetEmailAddressEmail);
      }
    });
  }

 ngOnInit() {
  
 }

 private _signInWithEmailLink(email: string) {
  this._authService.signInWithEmailLink(email).then(() => {
    this.canResetEmail = true;
  }).catch(() => {
    this.setIsFailure(`Please try again.`);
  });
  
}


 deleteAccountInit() {
  console.log("delete-account method called");
  this.accountDeletion = this._authService.deleteAccountInit();
  this.deletePromptText = "Last chance. Are you sure you want to delete your account?  This action can't be undone.";
  this.deleteButtonText = "Yes, please delete";
  this.cancelButtonText = "Opps, no. Don't delete";
   
}

  deleteAccountFinal() {
    console.log("delete-account method called");
    this._authService.deleteAccountFinal(this.accountDeletion).then(() => {
    this.setIsSuccess(`This account has been deleted. Join us again any time!`);
    // this.authService.revokeToken();
    }).catch(() => {
      this.resetDeletion(); 
      this.setIsFailure("There was a problem deleting your account. Please try again.");
    });
    
  }

  deleteAccountRollback() {
    this._authService.deleteAccountRollback(this.accountDeletion);
    this.resetDeletion(); 
    this.dismiss();
  }

  resetDeletion() {
    this.deleteButtonText = "Delete";
    this.cancelButtonText = "Cancel";
    this.deletePromptText = "Sorry to see you go, thanks for being a part of Neat Boutique.";
    this.accountDeletion = null;
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
