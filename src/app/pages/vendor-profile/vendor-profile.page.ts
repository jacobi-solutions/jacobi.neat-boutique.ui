import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { ReviewDisplay } from 'src/app/models/review-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { VendorReview } from 'src/app/models/vendor-review';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { VendorService } from 'src/app/services/vendor.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.page.html',
  styleUrls: ['./vendor-profile.page.scss'],
})
export class VendorProfilePage implements OnInit {
  @Input() vendor: VendorDisplay;
  public pageName = 'Vendor Profile';
  public photos: string[] = [];
  public currentUser: CurrentUserDisplay = null;
  public reviewRatings: number[] = [];
  private _maxPhotos: number = 4;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _util: UtilService,
    private _accountService: AccountsService,
    private _vendorService: VendorService,
    private _consumerActionService: ConsumerService
  ) {}

  ngOnInit() {
    this._accountService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
        this.currentUser = user;
    });   

    const routeParams = this._activatedRoute.snapshot.paramMap;    
    const vendorPath = routeParams.get('vendorPath');  
    
    this._vendorService.getVendorProfileWithReviewsByPath(vendorPath).then(vendor => {      
      this.vendor = vendor;
      this.pageName = vendor?.name;   

      for (const [key, value] of Object.entries(vendor.photosDictionary)) {
        this.photos.push(value);
      }
      

      // fill photos to max number
      // needed for consistent photo arrangement
      let photoCount = this.photos?.length;
      if((photoCount > 0) && (photoCount < this._maxPhotos)) {
        this.photos = [...this.photos, ...(new Array(this._maxPhotos - photoCount).fill(null))];
      }
    })
    // no vendor returned
    .catch(e => this._router.navigate(['/feed']));
  }

  filterOutDeletedReviews() {
    this.vendor.filterDeletedReviews();
  }

  canLeaveReview() {
    var test = !this.vendor.reviews.some(x => x.author.id === this.currentUser.consumer.id);
    return test;
  }
}







    