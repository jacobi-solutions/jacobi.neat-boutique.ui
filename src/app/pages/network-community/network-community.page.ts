import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VendorNetworkMembershipTypes } from 'src/app/constants/vendor-network-membership-types';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { CustomerDiscount, Network, VendorNetworkMembership, VendorProfile } from 'src/app/services/neat-boutique-api.service';
import { NetworkService } from 'src/app/services/network.service';
import { FormArray, FormBuilder, FormGroup, Validators, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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
import { ToastController } from '@ionic/angular';

export const NetworkTabTypes = {
  MAP: "Map",
  NETWORK_FEED: "Network Feed",
  TOP_MEMBERS: "Top Members", 
  SETTINGS: "Settings"
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

  // Network editing properties
  editNetworkName: boolean = false;
  editNetworkDescription: boolean = false;
  networkNameForm: UntypedFormGroup;
  networkDescriptionForm: UntypedFormGroup;
  maxNetworkNameChars: number = 100;
  maxNetworkDescriptionChars: number = 500;

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
    private _categoryService: CategoryService, private _answersService: AnswersService,
    private _toastController: ToastController) {
    
    this.addMemberForm = this._fb.group({
      businessName: ['', Validators.required],
    });

    // Initialize network editing forms
    this.networkNameForm = new UntypedFormGroup({
      name: new UntypedFormControl('', [Validators.required, Validators.maxLength(this.maxNetworkNameChars)]),
    });

    this.networkDescriptionForm = new UntypedFormGroup({
      description: new UntypedFormControl('', [Validators.required, Validators.maxLength(this.maxNetworkDescriptionChars)]),
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
    // Handle route parameters - both inviteId and networkId
    const routeParams = this._activatedRoute.snapshot.paramMap;
    const inviteId = routeParams.get('inviteId');
    const networkId = routeParams.get('networkId');

    if (inviteId) {
      // Invite flow - load network by membership ID
      this._networkService.loadNetworkByVendorNetworkMembershipId(inviteId).then((membership: VendorNetworkMembership) => {
        if (membership.role === VendorNetworkMembershipTypes.INVITED) {
          this.isVendorInvited = true;
          this._inviteId = inviteId;
        }
        // Network and posts will be loaded via the networkPromise subscription below
      }).catch(() => {
        this._router.navigateByUrl('/vendor-settings', { state: this.currentUser?.vendor });
      });
    } else if (networkId) {
      // Public network flow - load network by network ID
      this._networkService.loadNetwork(networkId).then(() => {
        // Network and posts will be loaded via the networkPromise subscription below
      }).catch(() => {
        this._router.navigateByUrl('/vendor-settings', { state: this.currentUser?.vendor });
      });
    }

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
        
        // If this was the first post and we're on MAP tab, switch to NETWORK_FEED
        if (this.networkPosts.length === 1 && this.currentNetworkTab === this.networkTabTypes.MAP) {
          this.currentNetworkTab = this.networkTabTypes.NETWORK_FEED;
        }
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
      this.inviteLink = `${environment.lociUIBaseUrl}/network-community/invite/${membership.id}`;
    }
  }

  updateDiscounts() {
    console.log(this.discountsForm.value);
    var discounts = this.discountsForm.value.discountsForNetworkMembers.map(discount => new CustomerDiscount(discount));
    
    this._networkService.updateNetworkMembership(this.currentVendorNetworkMembershipDisplay.id, discounts);
  }

  async copyNetworkLink() {
    if (!this.network?.id) {
      return;
    }

    const networkLink = `${environment.lociUIBaseUrl}/network-community/${this.network.id}`;
    
    try {
      await navigator.clipboard.writeText(networkLink);
      
      const toast = await this._toastController.create({
        message: 'A link to this network has been copied to your clipboard',
        duration: 4000,
        position: 'bottom',
        color: 'primary'
      });
      
      await toast.present();
    } catch (error) {
      console.error('Failed to copy link:', error);
      
      const toast = await this._toastController.create({
        message: 'Failed to copy link',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      
      await toast.present();
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

  // Network name editing methods
  public toggleEditNetworkName() {
    this.editNetworkName = !this.editNetworkName;
    if (this.editNetworkName) {
      this.networkNameForm.patchValue({ name: this.network?.name || '' });
    }
  }

  public async saveEditNetworkName() {
    if (this.networkNameForm.valid && this.network?.id) {
      try {
        const updatedNetwork = await this._networkService.updateNetworkName(
          this.network.id, 
          this.networkNameForm.value.name
        );
        this.network = updatedNetwork;
        this.editNetworkName = false;
      } catch (error) {
        console.error('Error updating network name:', error);
        // You might want to show a toast message for errors
      }
    }
  }

  // Network description editing methods
  public toggleEditNetworkDescription() {
    this.editNetworkDescription = !this.editNetworkDescription;
    if (this.editNetworkDescription) {
      this.networkDescriptionForm.patchValue({ description: this.network?.description || '' });
    }
  }

  public async saveEditNetworkDescription() {
    if (this.networkDescriptionForm.valid && this.network?.id) {
      try {
        const updatedNetwork = await this._networkService.updateNetworkDescription(
          this.network.id, 
          this.networkDescriptionForm.value.description
        );
        this.network = updatedNetwork;
        this.editNetworkDescription = false;
      } catch (error) {
        console.error('Error updating network description:', error);
        // You might want to show a toast message for errors
      }
    }
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
        if(this.networkPosts.length > 0) {
          this.currentNetworkTab = this.networkTabTypes.NETWORK_FEED;
        }
        this.showLoadMorePosts = posts.length === this.networkPostsPerPage;
        
        // If there are no posts, switch to MAP tab
        if (!posts || posts.length === 0) {
          this.currentNetworkTab = this.networkTabTypes.MAP;
        }
      })
      .catch(error => {
        console.error('Error loading network posts:', error);
        // If there's an error loading posts, default to MAP tab
        this.currentNetworkTab = this.networkTabTypes.MAP;
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