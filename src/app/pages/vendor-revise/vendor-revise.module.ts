import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorRevisePageRoutingModule } from './vendor-revise-routing.module';

import { VendorRevisePage } from './vendor-revise.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorRevisePageRoutingModule,
    SharedModule
  ],
  declarations: [VendorRevisePage]
})
export class VendorRevisePageModule {}
