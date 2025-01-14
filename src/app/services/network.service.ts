import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NeatBoutiqueApiService } from './neat-boutique-api.service';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  constructor(private neatBoutiqueApiService: NeatBoutiqueApiService) {}

  createNetwork(data: any): Observable<any> {
    return this.neatBoutiqueApiService.createNetwork(data);
    console.log(data);
  }

  // Add more methods as needed for managing networks
} 