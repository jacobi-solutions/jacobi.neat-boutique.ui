import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumerSettingsPageRoutingModule } from './consumer-settings-routing.module';

import { ConsumerSettingsPage } from './consumer-settings.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumerSettingsPageRoutingModule,
    SharedModule
  ],
  declarations: [ConsumerSettingsPage]
})
export class ConsumerSettingsPageModule {}
