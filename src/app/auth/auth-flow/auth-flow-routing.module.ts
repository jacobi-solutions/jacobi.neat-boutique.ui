import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { ChangeEmailFinalComponent } from './change-email-final/change-email-final.component';
import { ChangeEmailInitComponent } from './change-email-init/change-email-init.component';
import { ChangePasswordFinalComponent } from './change-password-final/change-password-final.component';
import { ChangePasswordInitComponent } from './change-password-init/change-password-init.component';
import { DeleteAccountFinalComponent } from './delete-account-final/delete-account-final.component';
import { DeleteAccountInitComponent } from './delete-account-init/delete-account-init.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
    // outlet: "jacobi-auth-flow-router"
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'change-password-init',
    component: ChangePasswordInitComponent
  },
  {
    path: 'change-password-final',
    component: ChangePasswordFinalComponent
  },
  {
    path: 'change-email-init',
    component: ChangeEmailInitComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'change-email-final',
    component: ChangeEmailFinalComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'delete-account-init',
    component: DeleteAccountInitComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'delete-account-final',
    component: DeleteAccountFinalComponent,
    canActivate: [ AuthGuard ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthFlowPageRoutingModule {}
