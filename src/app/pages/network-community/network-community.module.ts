import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NetworkCommunityPageRoutingModule } from './network-community-routing.module';

import { NetworkCommunityPage } from './network-community.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NetworkCommunityPageRoutingModule
  ],
  declarations: [NetworkCommunityPage]
})
export class NetworkCommunityPageModule {}
