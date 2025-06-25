import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VendorNetworkMembershipTypes } from 'src/app/constants/vendor-network-membership-types';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { CustomerDiscount, Network, VendorNetworkMembership, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { NetworkService } from 'src/app/services/network.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityDisplay } from 'src/app/models/entity-display';
import { debounceTime } from 'rxjs/operators';
import { THEME } from 'src/theme/theme-constants';
import { environment } from 'src/environments/environment';
import { TopVisitorDisplay } from 'src/app/models/top-visitor-display';
import { UtilService } from 'src/app/services/util.service';
import { AuthService } from 'src/app/auth/auth.service';
import {  } from 'googlemaps';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { Loader } from "@googlemaps/js-api-loader"
import { FeedTypes } from 'src/app/constants/feed-types';
import { PostDisplay } from 'src/app/models/post-display';
import { CategoryService } from 'src/app/services/category.service';
import { AnswersService } from 'src/app/services/answers.service';

export const NetworkTabTypes = {
  MAP: "Map",
  NETWORK_POST: "Network Post",
  TOP_VISITORS: "Top Visitors"
}

@Component({
  selector: 'app-network-community',
  templateUrl: './network-community.page.html',
  styleUrls: ['./network-community.page.scss'],
})
export class NetworkCommunityPage implements OnInit {
  
  // Add feed-related properties
  feedTypes = FeedTypes;
  networkPosts: PostDisplay[] = [];
  currentNetworkPostPage: number = 0;
  networkPostsPerPage: number = 10;
  showLoadMorePosts: boolean = false;
  
  @ViewChild('map') mapElement: ElementRef;
  currentNetworkTab = NetworkTabTypes.MAP;
  networkTabTypes = NetworkTabTypes;
  public defaultImg = THEME.avatar.defaultImage;
  currentUser: CurrentUserDisplay;
  network: Network;
  vendorNetworkMembershipTypes = VendorNetworkMembershipTypes;
  currentVendorNetworkMembershipDisplays: VendorNetworkMembershipDisplay[];
  currentVendorNetworkMembershipDisplay: VendorNetworkMembershipDisplay;
  addMemberForm: FormGroup;
  discountsForm: FormGroup;

  private _searchVendor: { minChars: number, lastSearchText: string, results: VendorDisplay[] };
  vendorProfileSearchResults: VendorDisplay[];
  selectedVendorToAdd: VendorDisplay;
  inviteLink: string;
  isVendorInvited: boolean = false;
  isInvitedVendorMember: boolean = false;
  isCurrentVendorOwner: boolean = false;
  isCurrentVendorMember: boolean = false;
  private _inviteId: string;

  public colors: string[] = THEME.colors.list;
  networkTopVisitors: TopVisitorDisplay[];

  googleMap: google.maps.Map;
  allMapMarkersMap: Map<string, google.maps.Marker> = new Map<string, google.maps.Marker>();
  orangeLocationIconUrl = "../../../assets/icons/loci-location-orange.svg";
  yellowLocationIconUrl = "../../../assets/icons/loci-location-red.svg";

  constructor(private _networkService: NetworkService, private _customersService: AccountsService, 
    private _fb: FormBuilder, private _router: Router, private _activatedRoute: ActivatedRoute,
    private _util: UtilService, private _authService: AuthService,
    private _categoryService: CategoryService, private _answersService: AnswersService) {
    const routeParams = this._activatedRoute.snapshot.paramMap;    
    const inviteId = routeParams.get('inviteId');    
    if(inviteId) {
      this._networkService.loadNetworkByVendorNetworkMembershipId(inviteId).then((membership: VendorNetworkMembership) =>{
        if(membership.role === VendorNetworkMembershipTypes.INVITED) {
          this.isVendorInvited = true;
          this._inviteId = inviteId;
        } 
      }).catch(() => {
        this._router.navigateByUrl('/vendor-settings', { state: this.currentUser.vendor });
      });
      
    }
    
    this.addMemberForm = this._fb.group({
      businessName: ['', Validators.required],
    });

    


    this._searchVendor = { minChars: 3, lastSearchText: '', results: [] };  
  }
  

  ionViewWillEnter() {
    // var postPromise = new Promise<void>((resolve, reject) => {
    //   this._postsService.getRouteById(this.lociCafeCrawlId).then((route) => {
    //     if(route) {
    //       this.route = route;
    //       this.routeQuestions = this.route.routeQuestions.map(x => new PostDisplay(x));
    //       this.showLoadMore = this.routeQuestions?.length === this.routeQuestionsPerPage;
    //       this.routeTopUsers = this._util.normalizedTopUsersForChartMinMax(this.route.routeTopUsers.map(x => new TopUserDisplay(x)));
    //       this.routeTopUsers.forEach((user: TopUserDisplay, index: number) => {
    //         user.barColor = this.colors[index % (this.colors?.length)];
    //         user.barWidth = user.barChartValue + '%';
    //       });
    //       resolve();
    //     }
    //   });
    // });

    var myVisitsPromise = new Promise<void>((resolve, reject) => {
      this._authService.isAuthenticated().then((isAuthenticated) => {
        if(isAuthenticated) {
          // this.currentUser = currentUser;
          // this._postsService.getMyVisitsOnRouteByRouteById(this.lociCafeCrawlId).then((myVisits: RouteSelectionVisit[]) => {
          //   this.myVisits = myVisits;
          //   resolve();
          // });
        }
      });
     
    });

    this.discountsForm = this._fb.group({
      discountsForNetworkMembers: this._fb.array([
       
      ]),
    });
    
   

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
      this.network = network;
      this._networkService.setCurrentNetwork(network);
    }

    var networkPromise = new Promise<void>((resolve, reject) => {
      this._networkService.currentNetworkSubject.subscribe(network => {
        if (network) {
          this.network = network;
          this._networkService.currentVendorNetworkMembershipsSubject.subscribe(memberships => {
            if(memberships) { 
              const currentMembership = memberships.find(membership => membership.vendorId === this.currentUser.vendor?.id);
              this.isCurrentVendorOwner = currentMembership?.role === VendorNetworkMembershipTypes.OWNER;
              this.isCurrentVendorMember = currentMembership?.role === VendorNetworkMembershipTypes.MEMBER;
              this.currentVendorNetworkMembershipDisplay = currentMembership ? new VendorNetworkMembershipDisplay(currentMembership) : null;
              this.currentVendorNetworkMembershipDisplays = memberships.filter(m => m.role === VendorNetworkMembershipTypes.OWNER || m.role === VendorNetworkMembershipTypes.MEMBER).map(membership => new VendorNetworkMembershipDisplay(membership));
              this.loadInitialDiscountsForCurrentMember(this.currentVendorNetworkMembershipDisplay);
              
              if (currentMembership?.role === VendorNetworkMembershipTypes.INVITED) {
                this.isVendorInvited = true;
                this._inviteId = currentMembership.id;
              }
              
              resolve();
            }
          });
          // Load network posts once we have the network ID
          this.loadNetworkPosts();
        }
      });
    });
    

    var mapPromise = new Promise<void>((resolve, reject) => {
      this.initMap();
      resolve();
    });

    Promise.all([networkPromise, mapPromise]).then(() => {
      this.loadNetworkIntoMap();
    });

    // Promise.all([networtkPromise, mapPromise, myVisitsPromise]).then(() => {
    //   this.updateNetworkWithMyVisits();
    // });
    // }

    // Subscribe to new network questions
    this._categoryService.newNetworkQuestionSubject.subscribe((post: PostDisplay) => {
      if (post && this.network?.id === post.feedContextId) {
        // Add the new post to the beginning of the list
        this.networkPosts = [post, ...this.networkPosts];
      }
    });
    
    // Subscribe to answer updates for network feed
    this._answersService.questionAnsweredOnNetworkQuestionSubject.subscribe((post: PostDisplay) => {
      if (post) {
        const index = this.networkPosts.findIndex(p => p.id === post.id);
        if (index !== -1) {
          this.networkPosts[index] = post;
        }
      }
    });
  }


  loadInitialDiscountsForCurrentMember(membership: VendorNetworkMembershipDisplay) {
    const discountsArray = this.discountsForm.get('discountsForNetworkMembers') as FormArray;
    while (discountsArray.length !== 0) {
      discountsArray.removeAt(0);
    }
    
    if(membership.discountsForNetworkMembers.length > 0) {
      membership.discountsForNetworkMembers.forEach(discount => {
        discountsArray.push(this._fb.group({
          description: [ discount.description || '' ], // Add description here
        }));
      });
    } else {
      discountsArray.push(this._fb.group({
        description: [ '' ], // Add description here
      }));
    }
  }
  
  
  // Getter for Network Discounts Array
  get discountsForNetworkMembers() {
    return this.discountsForm.get('discountsForNetworkMembers') as FormArray;
  }

  createDiscountGroup(): FormGroup {
    return this._fb.group({
      // visitsThreshold: [1, [Validators.required, Validators.min(1)]], // Must be positive
      // discountType: ['', Validators.required], // String instead of enum
      description: ['', Validators.required], // Can be percentage, fixed amount, etc.
    });
  }
  
  // Add Business Discount
  addDiscountsForNetworkMembers() {
    this.discountsForNetworkMembers.push(this.createDiscountGroup());
  }
  
  // Remove Business Discount
  removeDiscountsForNetworkMembers(index: number) {
    if(this.discountsForNetworkMembers.length > 1) {
      this.discountsForNetworkMembers.removeAt(index);
    }
  }
  
  
  goToVendor(vendor: VendorDisplay) {
    this._router.navigateByUrl('/vendor-profile/' + vendor.profilePath);
  }
  openExpansion(membership: VendorNetworkMembershipDisplay) {
    membership.vendorDisplay.expandNetworkCard = true;
  }

  closeExpansion(membership: VendorNetworkMembershipDisplay) {
    membership.vendorDisplay.expandNetworkCard = false;
  }

  toggleExpansion(membership: VendorNetworkMembershipDisplay) {
    membership.vendorDisplay.expandNetworkCard = !membership.vendorDisplay.expandNetworkCard;
  }

  selectVendor(vendor: VendorDisplay) {
    this.selectedVendorToAdd = vendor;
    this.isInvitedVendorMember = this.currentVendorNetworkMembershipDisplays.some(m => m.vendorId === vendor.id && m.role === VendorNetworkMembershipTypes.MEMBER);
  }

  cancelSelectedVendor() {
    this.selectedVendorToAdd = null;
  }

  async createInviteLink() {
    var membership = await this._networkService.createInviteLink(this.network.id, this.selectedVendorToAdd.id);
    if(membership.role === VendorNetworkMembershipTypes.MEMBER) { 
      this.inviteLink = "This business is already a member of this network";
    } else {
      this.inviteLink = `${environment.lociUIBaseUrl}/network-community/${membership.id}`;
    }
  }

  updateDiscounts() {
    console.log(this.discountsForm.value);
    var discounts = this.discountsForm.value.discountsForNetworkMembers.map(discount => new CustomerDiscount(discount));
    
    this._networkService.updateNetworkMembership(this.currentVendorNetworkMembershipDisplay.id, discounts);
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
    this._networkService.declineInvite(this._inviteId).then(() => {
      this._router.navigate(['/vendor-settings']);
    });
    
  }
  acceptInvite() {
    var discounts = this.discountsForm.value.discountsForNetworkMembers.map(discount => new CustomerDiscount(discount));
    
    this._networkService.acceptInvite(this._inviteId, discounts).then(() => {
      this._router.navigate(['/vendor-settings']);
    });
  }




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

  loadNetworkIntoMap() {
    var geocoder = new google.maps.Geocoder();
    let bounds = new google.maps.LatLngBounds();

    this.currentVendorNetworkMembershipDisplays.forEach((membership: VendorNetworkMembershipDisplay) => {
      var markerPosition = null;
      if(membership.geometryLocation?.latitude && membership.geometryLocation?.longitude) {
        markerPosition = new google.maps.LatLng(membership.geometryLocation.latitude, membership.geometryLocation.longitude);
        bounds.extend(markerPosition);
        var marker = this.addMarker(markerPosition, membership);
        this.allMapMarkersMap.set(membership.id, marker);
      }
    });

    this.googleMap.fitBounds(bounds);
  }

  updateNetworkWithMyVisits() {

    // this.myVisits.forEach((visit: RouteSelectionVisit) => {
    //   var marker = this.allMapMarkersMap.get(visit.selectionId);
    //   marker.setIcon({
    //     url: "../../../assets/icons/loci-location-orange.svg",
    //     scaledSize: new google.maps.Size(32, 32)
    //   });
    // });
  }

  addMarker(markerPosition: google.maps.LatLng, membership: VendorNetworkMembership) {
    
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
      content: `<h3>${membership.vendorProfile.name}</h3><p>Some more information about this place.</p>`
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

  // Add network feed methods
  loadNetworkPosts() {
    if (!this.network?.id) return;
    
    this._categoryService.getQuestionsByFeedContextId(this.network.id, this.currentNetworkPostPage, this.networkPostsPerPage)
      .then((posts: PostDisplay[]) => {
        this.networkPosts = posts;
        this.showLoadMorePosts = posts.length === this.networkPostsPerPage;
      })
      .catch(error => {
        console.error('Error loading network posts:', error);
      });
  }
  
  loadMoreNetworkPosts() {
    if (!this.network?.id) return;
    
    this.currentNetworkPostPage++;
    this._categoryService.getQuestionsByFeedContextId(this.network.id, this.currentNetworkPostPage, this.networkPostsPerPage)
      .then((posts: PostDisplay[]) => {
        this.networkPosts = [...this.networkPosts, ...posts];
        this.showLoadMorePosts = posts.length === this.networkPostsPerPage;
      })
      .catch(error => {
        console.error('Error loading more network posts:', error);
      });
  }
}

export class VendorNetworkMembershipDisplay extends VendorNetworkMembership {
  constructor(membership: VendorNetworkMembership) {
    super(membership);
    this.vendorDisplay = new VendorDisplay(membership.vendorProfile);
  }

  vendorDisplay: VendorDisplay;
}