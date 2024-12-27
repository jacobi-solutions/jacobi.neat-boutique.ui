import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { Category } from 'src/app/models/category';
import { CategoryDisplay, CategoryService } from 'src/app/services/category.service';
import { NbRoutingService } from 'src/app/services/nb-routing.service';
import { UtilService } from 'src/app/services/util.service';
import { VendorService } from 'src/app/vendor.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class BrowsePage implements OnInit {
  categories: Category[];
  constructor(private _nbRouter: NbRoutingService, private _categoryService: CategoryService) {

    this.categories = this._categoryService.categories;

    }
  ngOnInit() {
  }

  public browseCategory(category: string) {
    this._nbRouter.goToVendorListByCategory(category);
      // this.router.navigateByUrl('/vendor-list/'+ name);
  }

}
