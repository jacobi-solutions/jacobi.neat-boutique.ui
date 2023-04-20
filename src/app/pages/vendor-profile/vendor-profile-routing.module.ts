import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorProfilePage } from './vendor-profile.page';

const routes: Routes = [
  {
    path: '',
    component: VendorProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorProfilePageRoutingModule {}
