import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PostDisplay } from 'src/app/models/post-display';
import { RouteDisplay } from 'src/app/models/route-display';
import { CategoryService } from 'src/app/services/category.service';
import {  } from 'googlemaps';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { Loader } from "@googlemaps/js-api-loader"
import { environment } from 'src/environments/environment';
import { AnswerSearchRequest, NeatBoutiqueEntity, Post, RouteSelectionVisit, Selection } from 'src/app/services/neat-boutique-api.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AuthService } from 'src/app/auth/auth.service';
import { AnswersService } from 'src/app/services/answers.service';
import { AnswerDisplay } from 'src/app/models/answer-display';
import { THEME } from 'src/theme/theme-constants';
import { UtilService } from 'src/app/services/util.service';
import { TopUserDisplay } from 'src/app/models/top-user-display';
import { FeedTypes } from 'src/app/constants/feed-types';

export const RouteTabTypes = {
  MAP: "Map",
  ROUTE_POST: "Route Post",
  TOP_USERS: "Top Users"
}

@Component({
  selector: 'app-routes',
  templateUrl: './routes.page.html',
  styleUrls: ['./routes.page.scss'],
})
export class RoutesPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  route: RouteDisplay;
  googleMap: google.maps.Map;
  currentRouteTab = RouteTabTypes.MAP;
  routeTabTypes = RouteTabTypes;
  orangeLocationIconUrl = "../../../assets/icons/loci-location-orange.svg";
  yellowLocationIconUrl = "../../../assets/icons/loci-location-red.svg";
  currentUser: CurrentUserDisplay;
  myVisits: RouteSelectionVisit[];
  lociCafeCrawlId = "0b31f698-33f5-4c84-b4e2-86cc5f057136";
  allMapMarkersMap: Map<string, google.maps.Marker> = new Map<string, google.maps.Marker>();
  public routeQuestionsPerPage: number = 15;
  showLoadMore = false;
  routeQuestions: PostDisplay[];
  feedTypes = FeedTypes;
  topUsersPost: PostDisplay = new PostDisplay(new Post());
  public colors: string[] = THEME.colors.list;
  public normalize: any;
  routeTopUsers: TopUserDisplay[];
  

  constructor(private _postsService: CategoryService, private _authService: AuthService,
    private _answersService: AnswersService, private _categoryService: CategoryService,
    private _util: UtilService) {
    this._answersService.pollVotedOnSubject.subscribe((postDisplay: PostDisplay) => {
      if(postDisplay && postDisplay.id === this.route?.post?.id) {
        this.route.post = postDisplay;
      }
    });
    this._answersService.questionAnsweredOnRouteQuestionSubject.subscribe((postDisplay: PostDisplay) => {
      if(postDisplay && postDisplay?.feedContextId === this.route?.id) {
        var updatedQuestions = this._categoryService.updateConsumerPostInPosts(postDisplay, this.route.routeQuestions);
        this._answersService.refreshCurrentUserVotesOnPosts(updatedQuestions);
        this.routeQuestions = [ ...updatedQuestions ];
      }
    });
    this._categoryService.newRouteQuestionSubject.subscribe((postDisplay: PostDisplay) => {
      if(postDisplay && postDisplay?.feedContextId === this.route?.id) {
        this.route.routeQuestions = [ postDisplay, ...this.routeQuestions ];
        this.routeQuestions = this.route.routeQuestions;
      }
    });
    
  }

  ngOnInit() {
    
    // const mapProperties = {
    //   center: new google.maps.LatLng(35.2271, -80.8431),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
    // this.googleMap = new google.maps.Map(this.map.nativeElement, mapProperties);
  }

  ionViewWillEnter() {
    var postPromise = new Promise<void>((resolve, reject) => {
      this._postsService.getRouteById(this.lociCafeCrawlId).then((route) => {
        if(route) {
          this.route = route;
          this.routeQuestions = this.route.routeQuestions.map(x => new PostDisplay(x));
          this.showLoadMore = this.routeQuestions?.length === this.routeQuestionsPerPage;
          this.routeTopUsers = this._util.normalizedTopUsersForChartMinMax(this.route.routeTopUsers.map(x => new TopUserDisplay(x)));
          this.routeTopUsers.forEach((user: TopUserDisplay, index: number) => {
            user.barColor = this.colors[index % (this.colors?.length)];
            user.barWidth = user.barChartValue + '%';
          });
          resolve();
        }
      });
    });

    var myVisitsPromise = new Promise<void>((resolve, reject) => {
      this._authService.isAuthenticated().then((isAuthenticated) => {
        if(isAuthenticated) {
          // this.currentUser = currentUser;
          this._postsService.getMyVisitsOnRouteByRouteById(this.lociCafeCrawlId).then((myVisits: RouteSelectionVisit[]) => {
            this.myVisits = myVisits;
            resolve();
          });
        }
      });
     
    });
    
    var mapPromise = new Promise<void>((resolve, reject) => {
      this.initMap();
      resolve();
    });

    Promise.all([postPromise, mapPromise]).then(() => {
      this.loadRouteIntoMap();
    });

    Promise.all([postPromise, mapPromise, myVisitsPromise]).then(() => {
      this.updateRoutesWithMyVisits();
    });

  }

  loadMorePosts() {

  }
  //

  async initMap(){
    const loader = new Loader({
      apiKey: environment.googleMapsAPIKey,
      version: "weekly"
    });
    
    loader.load().then(async () => {
      const mapProperties = {
        center: new google.maps.LatLng(30.421590, -87.216904),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapId: "75993fb34c2cdcfc",
        disableDefaultUI: true,
        styles: this.mapStyles
      };
      this.googleMap = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    });
  }

  loadRouteIntoMap() {
    var geocoder = new google.maps.Geocoder();
    let bounds = new google.maps.LatLngBounds();

    this.route.post.selections.forEach((selection: Selection) => {
      var markerPosition = null;
      if(selection.geometryLocation?.latitude && selection.geometryLocation?.longitude) {
        markerPosition = new google.maps.LatLng(selection.geometryLocation.latitude, selection.geometryLocation.longitude);
        bounds.extend(markerPosition);
        var marker = this.addMarker(markerPosition, selection);
        this.allMapMarkersMap.set(selection.id, marker);
      }
    });

    this.googleMap.fitBounds(bounds);
  }
  updateRoutesWithMyVisits() {

    this.myVisits.forEach((visit: RouteSelectionVisit) => {
      var marker = this.allMapMarkersMap.get(visit.selectionId);
      marker.setIcon({
        url: "../../../assets/icons/loci-location-orange.svg",
        scaledSize: new google.maps.Size(32, 32)
      });
    });
  }

  addMarker(markerPosition: google.maps.LatLng, selection: Selection) {
    
    var locationUrl = this.yellowLocationIconUrl;
    //if()

    const marker = new google.maps.Marker({
      position: markerPosition,
      map: this.googleMap,
      title: 'Hello World!',
      // Custom Icon
      icon: {
        url: "../../../assets/icons/loci-location-yellow.svg",
        scaledSize: new google.maps.Size(32, 32), // Size of the icon,#013e43

      },
      
      // Animation
      animation: google.maps.Animation.DROP
    });

    // Info Window for Marker
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${selection.vendor.name}</h3><p>Some more information about this place.</p>`
    });

    marker.addListener('click', () => {
      infoWindow.open(this.googleMap, marker);
    });

    return marker;
  }

  
  mapStyles: google.maps.MapTypeStyle[] = [
    {
      featureType: "poi.attraction",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.government",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.medical",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.park",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.place_of_worship",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.school",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "poi.sports_complex",
      stylers: [{ visibility: "off" }]
    },
    // ... any other POI types you want to include
  ];


}
