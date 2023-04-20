import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorListPageRoutingModule } from './vendor-list-routing.module';

import { VendorListPage } from './vendor-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorListPageRoutingModule,
    SharedModule
  ],
  declarations: [VendorListPage]
})
export class VendorListPageModule {}
