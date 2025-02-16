import { Component, OnInit } from '@angular/core';
import { VendorNetworkMembershipTypes } from 'src/app/constants/vendor-network-membership-types';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { Network, VendorNetworkMembership, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { NetworkService } from 'src/app/services/network.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityDisplay } from 'src/app/models/entity-display';
import { debounceTime } from 'rxjs/operators';
import { THEME } from 'src/theme/theme-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-network-community',
  templateUrl: './network-community.page.html',
  styleUrls: ['./network-community.page.scss'],
})
export class NetworkCommunityPage implements OnInit {
  public defaultImg = THEME.avatar.defaultImage;
  currentUser: CurrentUserDisplay;
  isVendorOwner: boolean = false;
  currentNetwork: Network;
  currentVendorNetworkMembershipDisplays: VendorNetworkMembershipDisplay[];
  addMemberForm: FormGroup;

  private _searchVendor: { minChars: number, lastSearchText: string, results: VendorDisplay[] };
  vendorProfileSearchResults: VendorDisplay[];
  selectedVendorToAdd: VendorDisplay;
  inviteLink: string;
  isVendorInvited: boolean = false;
  private _inviteId: string;

  constructor(private _networkService: NetworkService, private _customersService: AccountsService, private _fb: FormBuilder, private _router: Router, private _activatedRoute: ActivatedRoute) {
    const routeParams = this._activatedRoute.snapshot.paramMap;    
    const inviteId = routeParams.get('inviteId');    
    if(inviteId) {
      this._networkService.loadNetworkByVendorNetworkMembershipId(inviteId).then(() =>{
        this.isVendorInvited = true;
        this._inviteId = inviteId;
      }).catch(() => {
        this._router.navigate(['/vendor-settings']);
      });
      
    }
    
    this.addMemberForm = this._fb.group({
      businessName: ['', Validators.required],
      // ownerName: ['', Validators.required],
      // phone: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]]
    });
    this._searchVendor = { minChars: 3, lastSearchText: '', results: [] };  
  }

  ngOnInit() {
    this.addMemberForm.controls.businessName.valueChanges
      .pipe(debounceTime(500))
      .subscribe((searchText) => {
        this.searchBusinesses(searchText);
      });


    this._customersService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      if(user) {
      this.currentUser = user;
      }
    });
    
   
    var network = (this._router.getCurrentNavigation().extras.state) as Network;  
    if(network) {
      this.currentNetwork = network;
      this._networkService.setCurrentNetwork(network);
    }
    this._networkService.currentNetworkSubject.subscribe(network => {
      if (network) {
        this.currentNetwork = network;
        this._networkService.currentVendorNetworkMembershipsSubject.subscribe(memberships => {
          if(memberships) { 
            this.currentVendorNetworkMembershipDisplays = 
            [ 
              ...memberships.map(membership => new VendorNetworkMembershipDisplay(membership)),
              ...memberships.map(membership => new VendorNetworkMembershipDisplay(membership)),
              ...memberships.map(membership => new VendorNetworkMembershipDisplay(membership)),
            ];
            this.isVendorOwner = this.currentVendorNetworkMembershipDisplays.some(membership => membership.vendorId === this.currentUser.vendor.id && membership.role === VendorNetworkMembershipTypes.OWNER);
          }
        });
      }
    });
    // }
  }

  toggleExpansion(membership: VendorNetworkMembershipDisplay) {
    membership.vendorDisplay.expandNetworkCard = !membership.vendorDisplay.expandNetworkCard;
  }

  selectVendor(vendor: VendorDisplay) {
    this.selectedVendorToAdd = vendor;
  }

  cancelSelectedVendor() {
    this.selectedVendorToAdd = null;
  }

  async createInviteLink() {
    var membership = await this._networkService.createInviteLink(this.currentNetwork.id, this.selectedVendorToAdd.id);
    if(membership.role === VendorNetworkMembershipTypes.MEMBER) { 
      this.inviteLink = "This business is already a member of this network";
    } else {
      this.inviteLink = `${environment.lociUIBaseUrl}/network-community/${membership.id}`;
    }
  }

  async searchBusinesses(rawSearchText: string) {
    const searchText = rawSearchText?.trim();
    if(searchText !== this.selectedVendorToAdd?.name) {
      this.selectedVendorToAdd = null;
    }

    if(searchText && (searchText?.length >= this._searchVendor.minChars) && (searchText !== this._searchVendor?.lastSearchText)) {
      this._searchVendor.lastSearchText = searchText;
      this._searchVendor.results = await this._networkService.autocompleteSearchForVendoorProfile(searchText);
      this.vendorProfileSearchResults = this._searchVendor.results;  
      console.log(this.vendorProfileSearchResults);    
    } else {
      this.vendorProfileSearchResults = [];
      this._searchVendor.lastSearchText = '';
    }   
  }

  

  toggleVendorDetails(vendor: any) {
    vendor.showDetails = !vendor.showDetails;
  }

  viewVendorPage(vendor: any) {
    // Logic to navigate to the vendor's page
    console.log('Navigating to vendor page:', vendor);
  }

  declineInvite() {
    this._networkService.declineInvite(this._inviteId);
    this._router.navigate(['/vendor-settings']);
  }
  acceptInvite() {
    this._networkService.acceptInvite(this._inviteId);
  }

}

export class VendorNetworkMembershipDisplay extends VendorNetworkMembership {
  constructor(membership: VendorNetworkMembership) {
    super(membership);
    this.vendorDisplay = new VendorDisplay(membership.vendorProfile);
  }

  vendorDisplay: VendorDisplay;
}