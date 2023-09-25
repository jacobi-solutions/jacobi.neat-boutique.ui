import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { VendorService as VendorService } from 'src/app/vendor.service';

@Component({
  selector: 'app-vendor-settings',
  templateUrl: './vendor-settings.page.html',
  styleUrls: ['./vendor-settings.page.scss'],
})
export class VendorSettingsPage implements OnInit {

  public pageName: string = 'vendor-settings';
  public vendor: VendorDisplay = null;
  public newLogo: any;
  public newLogoFileType: string;

  constructor(private _accountsService: AccountsService, private _vendorService: VendorService, private _router: Router) {  
    var vendorProfile = (this._router.getCurrentNavigation().extras.state) as VendorProfile;  
    if(vendorProfile) {
      this.vendor = new VendorDisplay(vendorProfile);
      this._vendorService.getVendorProfileWithReviewsById(this.vendor.id).then((vendor: VendorDisplay) => {
        if (vendor) {
          this.vendor = vendor;
        }
      });
    }
    
    // const routeParams = this._activatedRoute.snapshot.paramMap;    
    // const fileId = routeParams.get('fileId');  

    // watch for user changes
    
        
   
  }
  
  ngOnInit() {}
}
