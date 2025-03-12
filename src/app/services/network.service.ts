import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AnswerSearchRequest, AnswerSearchResponse, CreateNetworkRequest, CustomerDiscount, NeatBoutiqueApiService, Network, NetworkInviteRequest, NetworkRequest, NetworkResponse, NetworkWithVendorsResponse, Response, UpdateVendorMembershipinNetworkRequest, VendorNetworkMembership, VendorNetworkMembershipResponse, VendorProfile, VendorProfileResponse, VendorProfilesResponse } from './neat-boutique-api.service';
import { EntityDisplay } from '../models/entity-display';
import { VendorDisplay } from '../models/vendor-display';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private _currentNetwork: any = null;
  public currentNetworkSubject: BehaviorSubject<Network> = new BehaviorSubject<Network>(null);
  private _currentVendorNetworkMemberships: any[] = [];
  public currentVendorNetworkMembershipsSubject: BehaviorSubject<VendorNetworkMembership[]> = new BehaviorSubject<VendorNetworkMembership[]>(null);

  constructor(private _neatBoutiqueApiService: NeatBoutiqueApiService) {}

  setCurrentNetwork(network: Network) {
    this._currentNetwork = network;
    this.currentNetworkSubject.next(this._currentNetwork);
    this.loadNetwork(network.id);

  }

  

  createNetwork(name: string, description: string, discountsForNetworkMembers: CustomerDiscount[], vendorId: string) {
    var promise = new Promise((resolve, reject) => {
      var request = new CreateNetworkRequest();
      request.name = name;
      request.description = description;
      request.vendorId = vendorId;
      
      
      request.discountsForNetworkMembers = discountsForNetworkMembers.map(x => 
          x instanceof CustomerDiscount ? x : new CustomerDiscount(x)
      );
      this._neatBoutiqueApiService
        .createNetwork(request).subscribe((response: NetworkResponse) => {
          if (response.isSuccess) {
            this.setCurrentNetwork(response.network);
            resolve(response.network);
          }
        });
    });
    return promise;
  }

  updateNetworkMembership(vendorNetworkMembershipId: string, discountsForNetworkMembers: CustomerDiscount[]) {
    var request = new UpdateVendorMembershipinNetworkRequest();
    request.membershipId = vendorNetworkMembershipId;
    request.discountsForNetworkMembers = discountsForNetworkMembers;
    this._neatBoutiqueApiService.updateVendorMembershipInNetwork(request).subscribe((response: NetworkWithVendorsResponse) => {
      if (response.isSuccess) {
        this._currentNetwork = response.network;
          this.currentNetworkSubject.next(this._currentNetwork);
          this._currentVendorNetworkMemberships = response.memberships;
          this.currentVendorNetworkMembershipsSubject.next(this._currentVendorNetworkMemberships);
      }
    });
  }

  acceptInvite(vendorNetworkMembershipId: string, discountsForNetworkMembers: CustomerDiscount[]) {
    var request = new UpdateVendorMembershipinNetworkRequest();
    request.membershipId = vendorNetworkMembershipId;
    request.discountsForNetworkMembers = discountsForNetworkMembers;
    this._neatBoutiqueApiService.acceptNetworkInvite(request).subscribe((response: NetworkWithVendorsResponse) => {
      if (response.isSuccess) {
        this._currentNetwork = response.network;
          this.currentNetworkSubject.next(this._currentNetwork);
          this._currentVendorNetworkMemberships = response.memberships;
          this.currentVendorNetworkMembershipsSubject.next(this._currentVendorNetworkMemberships);
      }
    });
  }

  declineInvite(vendorNetworkMembershipId: string) {
    var request = new NetworkRequest();
    request.vendorNetworkMembershipId = vendorNetworkMembershipId;
    var promise = new Promise<void>((resolve, reject) => {
      this._neatBoutiqueApiService.declineNetworkInvite(request).subscribe((response: Response) => {
        if(response.isSuccess) {
          resolve();
        } else {
          reject('Failed to decline invite');
        }
      });
    });
    return promise;
  }

  createInviteLink(networkId: string, vendorId: string) {
    var request = new NetworkInviteRequest();
    request.networkId = networkId;
    request.vendorId = vendorId;
    var promise = new Promise<VendorNetworkMembership>((resolve, reject) => {
    this._neatBoutiqueApiService.getVendorNetworkMembershipInvite(request).subscribe((response: VendorNetworkMembershipResponse) => {
      if (response.isSuccess) {
        resolve(response.vendorNetworkMembership);
      } else {
        reject('Failed to create invite link');
      }
    });
    });
    return promise;
  }
  loadNetworkByVendorNetworkMembershipId(vendorNetworkMembershipId: string) {
    var request = new NetworkRequest();
    request.vendorNetworkMembershipId = vendorNetworkMembershipId;
    var promise = new Promise<VendorNetworkMembership>((resolve, reject) => {
      this._neatBoutiqueApiService.getNetworkByMembershipIdWithInviteLink(request).subscribe((response: NetworkWithVendorsResponse) => {
        if (response.isSuccess) {
          this._currentNetwork = response.network;
          this.currentNetworkSubject.next(this._currentNetwork);
          this._currentVendorNetworkMemberships = response.memberships;
          this.currentVendorNetworkMembershipsSubject.next(this._currentVendorNetworkMemberships);

          var currentVendorNetworkMembership = this._currentVendorNetworkMemberships.find(m => m.id === vendorNetworkMembershipId);
          resolve(currentVendorNetworkMembership);
        } else {
           // Redirect to vendor settings page
          reject();
        }
      });
    });
    return promise;
  }

  loadNetwork(networkId: string) {
    var request = new NetworkRequest();
    request.networkId = networkId;

    var promise = new Promise<void>((resolve, reject) => {
      this._neatBoutiqueApiService
        .getNetworkWithVendorNetworkMemberships(request)
        .subscribe((response: NetworkWithVendorsResponse) => {
          if (response.isSuccess) {
            this._currentNetwork = response.network;
            this.currentNetworkSubject.next(this._currentNetwork);
            this._currentVendorNetworkMemberships = response.memberships;
            this.currentVendorNetworkMembershipsSubject.next(this._currentVendorNetworkMemberships);
            resolve();
          } else {
            reject('Failed to load network');
          }
        }, error => reject(error));
    });

    return promise;
  }

  autocompleteSearchForVendoorProfile(searchRequest: string) {
    const request = new AnswerSearchRequest();
    request.searchString = searchRequest;
    var promise = new Promise<VendorDisplay[]>((resolve, reject) => {
      this._neatBoutiqueApiService
        .autoCompleteSearchVendorProfiles(request)
        .subscribe((response: VendorProfilesResponse) => {
          if (response.isSuccess) {
            resolve(response.vendorProfiles.map(x => new VendorDisplay(x)));
          } else {
            //reject();
          }
      });
    }) 
    return promise;
  }



  

} 