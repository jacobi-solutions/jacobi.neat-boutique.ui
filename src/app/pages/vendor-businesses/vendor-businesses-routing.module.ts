import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorBusinessesPage } from './vendor-businesses.page';

const routes: Routes = [
  {
    path: '',
    component: VendorBusinessesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorBusinessesPageRoutingModule {}
