import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorRevisePage } from './vendor-revise.page';

const routes: Routes = [
  {
    path: '',
    component: VendorRevisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorRevisePageRoutingModule {}
