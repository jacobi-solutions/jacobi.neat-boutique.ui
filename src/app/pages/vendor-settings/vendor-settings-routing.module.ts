import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { BillboardAdComponent } from './sub-routes/billboard-ad/billboard-ad.component';
import { PollAdComponent } from './sub-routes/poll-ad/poll-ad.component';

import { VendorSettingsPage } from './vendor-settings.page';
import { CreateCommunityComponent } from './sub-routes/create-community/create-community.component';

const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    component: VendorSettingsPage
  },
  {
    path: 'billboard-ads',
    component: BillboardAdComponent
  },
  {
    path: 'poll-ads',
    component: PollAdComponent
  },
  {
    path: 'create-category',
    component: CreateCommunityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorSettingsPageRoutingModule {}
