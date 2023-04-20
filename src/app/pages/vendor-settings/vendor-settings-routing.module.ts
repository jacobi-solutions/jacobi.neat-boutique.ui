import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { CommunityBillboardAdComponent } from './sub-routes/community-billboard-ad/community-billboard-ad.component';
import { PollAdComponent } from './sub-routes/poll-ad/poll-ad.component';

import { VendorSettingsPage } from './vendor-settings.page';

const routes: Routes = [
  {
    path: '',
    // pathMatch: 'full',
    component: VendorSettingsPage
  },
  {
    path: 'community-billboard-ads',
    component: CommunityBillboardAdComponent
  },
  {
    path: 'poll-ads',
    component: PollAdComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorSettingsPageRoutingModule {}
