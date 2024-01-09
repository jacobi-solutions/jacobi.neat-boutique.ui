import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {  } from 'googlemaps';
import { GoogleMapsService } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {
  @ViewChild('map') map: ElementRef;
  googleMap: google.maps.Map;
  constructor(private _googleMapsService: GoogleMapsService) { }

  ngOnInit() {
    

    // const mapProperties = {
    //   center: new google.maps.LatLng(35.2271, -80.8431),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
    // this.googleMap = new google.maps.Map(this.map.nativeElement, mapProperties);
  }

  ionViewWillEnter(){
    this._googleMapsService.loadAPI('AIzaSyCUpbApsq6RKqWDTgdRkOHsHcZb39eBMgM').then(() => {
      this.initMap();
    });

  }

  //

  async initMap(){
    const mapProperties = {
      center: new google.maps.LatLng(30.421590, -87.216904),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapId: "75993fb34c2cdcfc",
      disableDefaultUI: true,
    };
    this.googleMap = new google.maps.Map(this.map.nativeElement, mapProperties);

    let bounds = new google.maps.LatLngBounds();
    var markerPosition = null;
    markerPosition = new google.maps.LatLng(30.42650584874309, -87.2025723885036);
    bounds.extend(markerPosition);
    this.addMarker(markerPosition, "Sky's Pizza");

    markerPosition = new google.maps.LatLng(30.410444039985336, -87.21439038465853);
    bounds.extend(markerPosition);
    this.addMarker(markerPosition, "Graffit Pizza");

    markerPosition = new google.maps.LatLng(30.477945309574356, -87.22529621733732);
    bounds.extend(markerPosition);
    this.addMarker(markerPosition, "Ozone's Pizza");

    this.googleMap.fitBounds(bounds);

    // const listener = google.maps.event.addListener(this.googleMap, "idle", function () {
    //   if (this.googleMap.getZoom() > 16) this.googleMap.setZoom(16);
    //   google.maps.event.removeListener(listener);
    // });
    // for(let i = 0; i < 10 ; i++){
    //  this.addMarker(this.map,i,i,"jow sicha");
    // // }


    // const { AdvancedMarkerElement } = await importLibrary("marker");
    // var map = this.googleMap;
    // const marker = new AdvancedMarkerElement({
    //   map,
    //     position: { lat: 30.421590, lng: -87.216904 },
    // });
    
  }

  addMarker(markerPosition: google.maps.LatLng, name: string): void {
    

    const marker = new google.maps.Marker({
      position: markerPosition,
      map: this.googleMap,
      title: 'Hello World!',
      // Custom Icon
      icon: {
        url: 'https://storage.googleapis.com/neatboutique.com/images/loci_logomark_1024_color.png',
        scaledSize: new google.maps.Size(32, 32) // Size of the icon
      },
      // Animation
      animation: google.maps.Animation.DROP
    });

    // Info Window for Marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${name}</h3><p>Some more information about this place.</p>`
    });

    marker.addListener('click', () => {
      infoWindow.open(this.googleMap, marker);
    });
  }


}
