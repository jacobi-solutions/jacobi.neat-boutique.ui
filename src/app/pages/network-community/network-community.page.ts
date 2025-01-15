import { Component, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/services/network.service';

@Component({
  selector: 'app-network-community',
  templateUrl: './network-community.page.html',
  styleUrls: ['./network-community.page.scss'],
})
export class NetworkCommunityPage implements OnInit {
  private _currentNetwork: any;

  constructor(private _networkService: NetworkService) { }

  ngOnInit() {
    this._networkService.currentNetworkSubject.subscribe(network => {
      if (network) {
        this._currentNetwork = network;
      }
    });
  }

}
