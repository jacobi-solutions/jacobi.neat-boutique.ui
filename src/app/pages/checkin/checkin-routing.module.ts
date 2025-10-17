import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckinPage } from './checkin.page';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  {
    path: ':vendorId',
    component: CheckinPage,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: CheckinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckinPageRoutingModule {}
