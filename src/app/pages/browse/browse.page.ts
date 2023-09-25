import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { CommunityCategory } from 'src/app/models/community-category';
import { CommunityDisplay, CommunityService } from 'src/app/services/community.service';
import { NbRoutingService } from 'src/app/services/nb-routing.service';
import { UtilService } from 'src/app/services/util.service';
import { VendorService } from 'src/app/vendor.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {
  communities: CommunityCategory[];
  constructor(private _nbRouter: NbRoutingService, private _communityService: CommunityService) {

    this.communities = this._communityService.communities;

    }
  ngOnInit() {
  }

  public browseCategory(category: string) {
    this._nbRouter.goToVendorListByCategory(category);
      // this.router.navigateByUrl('/vendor-list/'+ name);
  }

}
