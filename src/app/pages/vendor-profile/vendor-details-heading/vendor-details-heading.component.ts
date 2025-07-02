import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ModalService } from 'src/app/services/modal.service';
import { THEME } from 'src/theme/theme-constants';


@Component({
  selector: 'app-vendor-details-heading',
  templateUrl: './vendor-details-heading.component.html',
  styleUrls: ['../vendor-profile.page.scss', './vendor-details-heading.component.scss'],
})
export class VendorDetailsHeadingComponent implements OnInit {

  @Input() vendor: VendorDisplay;
  public currentUser: CurrentUserDisplay;
  public isAddedToMyList: boolean;
  public defaultLogoImg = THEME.avatar.defaultImage;

  constructor(
    private _accountService: AccountsService,
    private _consumerActionService: ConsumerService,
    private _modalService: ModalService,
    private _router: Router) { }

  ngOnInit() {
    this._accountService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this.currentUser = user;      
    });    
  }

  ngDoCheck() {
    if(this.currentUser) {
      const isSetMyList = this.currentUser?.consumer.myPlacesVendorIds?.some(id => id === this.vendor.id)
      if(this.currentUser && (this.isAddedToMyList !== isSetMyList)) {
        this.isAddedToMyList = this.currentUser?.consumer.myPlacesVendorIds?.some(id => id === this.vendor.id);
      }
    }
    
  }

  async addToMyList() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }

    this.isAddedToMyList = await this._consumerActionService.addVendorToMyPlaces(this.vendor);
  }

  async removeFromMyList() {
    if(!this.currentUser) {
      this._modalService.displayRequireLoginModal();
      return;
    }

    this.isAddedToMyList = (await this._consumerActionService.removeVendorFromMyPlaces(this.vendor));
  }

  goToNetworkCommunity() {
    if (this.vendor.network) {
      this._router.navigateByUrl('/network-community', { state: this.vendor.network });
    }
  }
}
