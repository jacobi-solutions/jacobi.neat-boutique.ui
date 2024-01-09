import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  private loaded = false;
  constructor() { }
  
  loadAPI(key: string): Promise<void> {
    if (this.loaded) return Promise.resolve();
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.loaded = true;
        resolve();
      };
      document.body.appendChild(script);
    });
  }
}
