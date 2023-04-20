import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorListPage } from './vendor-list.page';

const routes: Routes = [
  {
    path: '',
    component: VendorListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorListPageRoutingModule {}
