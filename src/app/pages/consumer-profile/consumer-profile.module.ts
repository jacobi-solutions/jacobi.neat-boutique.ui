import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumerProfilePageRoutingModule } from './consumer-profile-routing.module';

import { ConsumerProfilePage } from './consumer-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyListComponent } from '../../shared/my-list/my-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumerProfilePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    ConsumerProfilePage
  ]
})
export class ConsumerProfilePageModule {}
