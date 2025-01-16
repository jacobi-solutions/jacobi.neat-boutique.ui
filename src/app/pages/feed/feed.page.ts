import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostDisplay } from 'src/app/models/post-display';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { CategoryTypes } from 'src/app/constants/category-types';
import { UserRoleTypes } from 'src/app/constants/user-role-types';
import { CategoryDisplay, CategoryService } from 'src/app/services/category.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { Post, ContactUsRequest, HeroAdTemplate, NeatBoutiqueEntity, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalService } from 'src/app/services/modal.service';
import { THEME } from 'src/theme/theme-constants';
import { Category } from 'src/app/models/category';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { VendorService } from 'src/app/vendor.service';
import { NbRoutingService } from 'src/app/services/nb-routing.service';


@Component({
  selector: 'app-category',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  
  public defaultProfileImg = THEME.avatar.defaultImage;
  public consumerPosts: PostDisplay[] = [];
  public vendorPosts: PostDisplay[] = [];
  public recentPosts: PostDisplay[];
  public heroAd: HeroAdTemplate;
  public categories: Category[];
  public vendorPollIntervalPlacement: number = 3;
  public pageName = 'Feed';
  public showLoadMore = false;
  public categoryTextNameDefaultColor: string = THEME.colors.variant.lightGey;
  public categoryTextNameColor: string = THEME.colors.variant.lightGey;
  public creatingNewPost: boolean = false;
  public validQuestionPost: boolean = false;
  public currentUser: CurrentUserDisplay = null;
  public promotedVendors: VendorDisplay[] = null;
  public specificPost: PostDisplay;
  public alreadyAttemptedToGetSpecificPost: boolean;
  public userHasSeenNonEditableModal: boolean;
  private _consumerPostsBatchCount: number;
  
  constructor(
    private _categoryService: CategoryService,
    private _accountService: AccountsService,
    private _util: UtilService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _siteVendorService: VendorService,
    private _modalService: ModalService,
    private _nbRoutingService: NbRoutingService) {
      
    this.userHasSeenNonEditableModal = this._categoryService.userHasSeenNonEditableModal;
    this.categories = this._categoryService.categories;

    const routeParams = this._activatedRoute.snapshot.paramMap;    
    const postId = routeParams.get('postId');    
    if(postId) {
      this._categoryService.getPostById(postId).then((post: PostDisplay) => {
        if(post) {
          this.specificPost = post;
        }
      });
    }


    this._loadPosts();
    this._loadPromotedVendors();
  }

  ngOnInit() {
    this._accountService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
        this.currentUser = user;
    });    
  }
  updateSelectedCategories(category: Category) {  
    category.isSelected = !category.isSelected;
    this._categoryService.updateShownCategories();
  }

  addCategoryToShownPosts(categoryName: string) {
    var category = this.categories.find(x => x.name === categoryName);
    category.isSelected = true;
    this._categoryService.updateShownCategories();
  }


  


  private async _loadPosts() {    
    this._categoryService.categoryDisplaySubject.subscribe((categoryDisplay: CategoryDisplay) => {
      if(categoryDisplay) {
        if(categoryDisplay.consumerPosts) {
          this.consumerPosts = categoryDisplay.consumerPosts.sort(this._util.sortByCreatedDateUtc);
        }
        if(categoryDisplay.recentConsumerPosts) {
          this.recentPosts = categoryDisplay.recentConsumerPosts.sort(this._util.sortByCreatedDateUtc);
        }
        if(categoryDisplay.vendorPosts) {
          this.vendorPosts = categoryDisplay.vendorPosts.sort(this._util.sortByCreatedDateUtc);
        }
        if(categoryDisplay.heroAds) {
          this.heroAd = categoryDisplay.heroAds[0];
        }

        if(this.specificPost) {
          var specificPost = this.consumerPosts.find(x => x.id == this.specificPost.id);
          const index = this.consumerPosts.indexOf(specificPost);
          if (index > -1) {
            this.consumerPosts.splice(index, 1);
          }
        }


        this.showLoadMore = categoryDisplay.canLoadMorePosts;
  
        this._consumerPostsBatchCount = Math.floor(categoryDisplay.consumerPosts.length / categoryDisplay.vendorPosts.length);
      }
    });
  }

  // TODO: replace with real promo when ready
  private async _loadPromotedVendors() {
    this.promotedVendors = [
      await this._siteVendorService.getVendorProfileWithReviewsByPath('70a1c211-bed3-4524-813c-b457e88ac3af'),
      await this._siteVendorService.getVendorProfileWithReviewsByPath('70a1c211-bed3-4524-813c-b457e88ac3af'),
      await this._siteVendorService.getVendorProfileWithReviewsByPath('70a1c211-bed3-4524-813c-b457e88ac3af')
    ];
  }


  expandItem(item): void {
    if (item.expanded) {
      item.expanded = false;
    } else {
      this.consumerPosts.map(listItem => {
        if (item === listItem) {
          listItem.expanded = !listItem.expanded;
        } else {
          listItem.expanded = false;
        }
        return listItem;
      });
    }
  }


  goToPromotedVendor(vendor: VendorDisplay) {
    const navExtras: NavigationExtras = { state: { vendor } };
    this._router.navigate(['/vendor-profile'], navExtras);
  }
  
  
  async loadMorePosts() {
    this._categoryService.loadMorePosts();
  }

  shouldShowVendorPost(index: number) {
    if(this.getVendorPostIndex(index) >= this.vendorPosts.length) return false;

    // only want to show a vendor post when evenly distributed
    return index % this._consumerPostsBatchCount === this._consumerPostsBatchCount - 1;
  }
  getVendorPostIndex(index: number) {
    return ((index + 1) / this._consumerPostsBatchCount) - 1;
  }
}
