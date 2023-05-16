import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthFlowPageRoutingModule } from './auth-flow-routing.module';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ChangeEmailFinalComponent } from './change-email-final/change-email-final.component';
import { ChangeEmailInitComponent } from './change-email-init/change-email-init.component';
import { ChangePasswordFinalComponent } from './change-password-final/change-password-final.component';
import { ChangePasswordInitComponent } from './change-password-init/change-password-init.component';
import { DeleteAccountFinalComponent } from './delete-account-final/delete-account-final.component';
import { DeleteAccountInitComponent } from './delete-account-init/delete-account-init.component';
import { LinkSignInMethodsComponent } from './link-sign-in-methods/link-sign-in-methods.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AuthFlowPageRoutingModule,
  ],

  declarations: [
    SignUpComponent,
    SignInComponent,
    ChangePasswordInitComponent,
    ChangePasswordFinalComponent,
    ChangeEmailInitComponent,
    ChangeEmailFinalComponent,
    DeleteAccountInitComponent,
    DeleteAccountFinalComponent,
    LinkSignInMethodsComponent
  ],
  
  exports: [
    SignUpComponent,
    SignInComponent,
    ChangePasswordInitComponent,
    ChangePasswordFinalComponent,
    ChangeEmailInitComponent,
    ChangeEmailFinalComponent,
    DeleteAccountInitComponent,
    DeleteAccountFinalComponent,
    LinkSignInMethodsComponent
  ]
})
export class AuthFlowPageModule {}
