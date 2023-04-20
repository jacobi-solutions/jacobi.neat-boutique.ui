import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorProfilePageRoutingModule } from './vendor-profile-routing.module';

import { VendorProfilePage } from './vendor-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { VendorBioComponent } from './vendor-bio/vendor-bio.component';
import { VendorDetailsHeadingComponent } from './vendor-details-heading/vendor-details-heading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VendorProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [
    VendorProfilePage,
    VendorBioComponent,
    VendorDetailsHeadingComponent,
  ]
})
export class VendorProfilePageModule {}
