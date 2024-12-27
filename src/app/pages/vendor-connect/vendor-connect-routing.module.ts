import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessCategoryComponent } from './new-vendor-flow/business-category/business-category.component';
import { ConnectBusinessComponent } from './new-vendor-flow/connect-business/connect-business.component';
import { ManualBusinessDetailsComponent } from './new-vendor-flow/manual-business-details/manual-business-details.component';
import { VendorPackagePricingComponent } from './new-vendor-flow/vendor-package-pricing/vendor-package-pricing.component';



const routes: Routes = [
  { 
    path: '',
    redirectTo: 'connect-business',
    pathMatch: 'full' 
  },
  {
    path: 'connect-business',
    component: ConnectBusinessComponent
  },
  {
    path: 'manual-business-details',
    component: ManualBusinessDetailsComponent
  },
  {
    path: 'business-category',
    component: BusinessCategoryComponent
  },
  {
    path: 'vendor-package-pricing',
    component: VendorPackagePricingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorUpgradePageRoutingModule {}
