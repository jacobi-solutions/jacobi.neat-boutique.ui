import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFlowPage } from './auth-flow/auth-flow.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PasswordConfirmMustMatchDirective } from './auth-flow/password-confirm-must-match.directive';
import { AuthConfig } from './auth.config';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { SharedModule } from '../shared/shared.module';


  
// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";

@NgModule({
  declarations: [
    AuthFlowPage,
    PasswordConfirmMustMatchDirective
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    AuthFlowPage
  ],
  providers: [
    Facebook
  ]
})
export class AuthModule {
  static forRoot(config: AuthConfig): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [{provide: AuthConfig, useValue: config}]
    };
  }
};
