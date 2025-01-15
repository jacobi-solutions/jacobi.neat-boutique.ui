import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NetworkCommunityPage } from './network-community.page';

const routes: Routes = [
  {
    path: '',
    component: NetworkCommunityPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetworkCommunityPageRoutingModule {}
