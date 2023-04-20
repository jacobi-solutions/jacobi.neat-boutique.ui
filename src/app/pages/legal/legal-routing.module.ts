import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataDeletionComponent } from './data-deletion/data-deletion.component';

import { LegalPage } from './legal.page';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'privacy-policy',
    component: LegalPage
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent
  },
  {
    path: 'data-deletion',
    component: DataDeletionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LegalPageRoutingModule {}
