import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorBusinessesPageRoutingModule } from './vendor-businesses-routing.module';

import { VendorBusinessesPage } from './vendor-businesses.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorBusinessesPageRoutingModule,
    SharedModule
  ],
  declarations: [VendorBusinessesPage]
})
export class VendorBusinessesPageModule {}
