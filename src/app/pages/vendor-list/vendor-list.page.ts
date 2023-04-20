import { Component, OnInit } from '@angular/core';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { CommunityTypes } from 'src/app/models/constants';
import { VendorService } from 'src/app/services/vendor.service';
import { NbRoutingService } from 'src/app/services/nb-routing.service';
import { CommunityService } from 'src/app/services/community.service';
import { CommunityCategory } from 'src/app/models/community-category';
import { THEME } from 'src/theme/theme-constants';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.page.html',
  styleUrls: ['./vendor-list.page.scss'],
})
export class VendorListPage implements OnInit {
  public pageName = 'Home';
  public vendors: VendorDisplay[];
  public category: CommunityCategory;
  public showLoadMore: boolean;
  public defaultImg = THEME.avatar.defaultImage;
  public vendorsHaveLoaded: boolean;

  constructor(
    private _nbRouter: NbRoutingService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _siteVendorService: VendorService,
    private _communityService: CommunityService) {}

  
  ngOnInit() {
    const categoryWords = this._nbRouter.getCategoryNameFromRoute(this._activatedRoute)   
    if(categoryWords) {
      this.category = this._communityService.getCommunityCategoryByNameDisplay(categoryWords);      
      this.pageName = 'Browse ' + this.category.name;
      this._loadVendors(this.category.name);      
    }
  }

  ionViewWillEnter() {
    // set this here for calls to to change page content 
    this.vendorsHaveLoaded = false;
  }

  private async  _loadVendors(category: string) {
    
    this._siteVendorService.getVendorsByCommunityName(category);
    this._siteVendorService.vendorsByCommunityNameSubject.subscribe((vendors: VendorDisplay[]) => {
      if(vendors) {
        this.vendors = vendors;
        this.vendorsHaveLoaded = true;
        
        if(this.vendors.length > 0 && this.vendors.length % 10 === 0) {
          this.showLoadMore = true;
        } else { 
          this.showLoadMore = false;
        }
      }
    });
  }
  
  public loadMoreVendors() {
    this._siteVendorService.loadMoreVendorsByCommunityName(this.category.name);
  }  
}
