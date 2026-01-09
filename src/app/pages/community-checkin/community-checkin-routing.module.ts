import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityCheckinPage } from './community-checkin.page';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: ':networkId',
    component: CommunityCheckinPage,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: CommunityCheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityCheckinPageRoutingModule {}
