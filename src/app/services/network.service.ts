import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CreateNetworkRequest, NeatBoutiqueApiService, NetworkResponse } from './neat-boutique-api.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private _currentNetwork: any = null;
  public currentNetworkSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private _neatBoutiqueApiService: NeatBoutiqueApiService) {}

  setCurrentNetwork(network: any) {
    this._currentNetwork = network;
    this.currentNetworkSubject.next(this._currentNetwork);
  }

  createNetwork(data: any) {
    var promise = new Promise((resolve, reject) => {
      var request = new CreateNetworkRequest();
      request.name = data.name;
      request.description = data.description;
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

  

} 