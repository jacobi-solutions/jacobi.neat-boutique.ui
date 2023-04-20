import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsumerSettingsPage } from './consumer-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ConsumerSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsumerSettingsPageRoutingModule {}
