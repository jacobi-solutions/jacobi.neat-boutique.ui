import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NetworkCommunityPageRoutingModule } from './network-community-routing.module';

import { NetworkCommunityPage } from './network-community.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NetworkCommunityPageRoutingModule,
    SharedModule
  ],
  declarations: [NetworkCommunityPage]
})
export class NetworkCommunityPageModule {}
