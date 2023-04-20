import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VendorUpgradePageRoutingModule } from './vendor-connect-routing.module';

import { VendorConnectPage } from './vendor-connect.page';
import { ConnectBusinessComponent } from './new-vendor-flow/connect-business/connect-business.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManualBusinessDetailsComponent } from './new-vendor-flow/manual-business-details/manual-business-details.component';
import { BusinessCommunityComponent } from './new-vendor-flow/business-community/business-community.component';
import { VendorPackagePricingComponent } from './new-vendor-flow/vendor-package-pricing/vendor-package-pricing.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VendorUpgradePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    VendorConnectPage,
    ConnectBusinessComponent,
    ManualBusinessDetailsComponent,
    BusinessCommunityComponent,
    VendorPackagePricingComponent
  ]
})
export class VendorConnectPageModule {}
