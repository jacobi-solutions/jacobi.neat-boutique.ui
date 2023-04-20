import { Component, OnInit, Input, ViewChildren, QueryList, EventEmitter, Output } from '@angular/core';
import { NavigationItem } from '../../models/navigation-item';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { MarqueeAdComponent } from '../marquee-ad/marquee-ad.component';
import { AccountsService } from 'src/app/services/accounts.service';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { UserSettingsPopoverComponent } from '../popovers/user-settings-popover/user-settings-popover.component';
import {ElementRef, ViewChild} from '@angular/core';
import { NbRoutingService } from 'src/app/services/nb-routing.service';
import { CommunityTypes } from 'src/app/models/constants';
import { HeaderGuard } from 'src/app/guards/header.guard';
import { HeaderDisplay } from 'src/app/models/header-display';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-nb-header',
  templateUrl: './nb-header.component.html',
  styleUrls: ['./nb-header.component.scss'],
})
export class NbHeaderComponent implements OnInit {
  @Output() login = new EventEmitter<string>();
  @Output() headerHeight = new EventEmitter<any>();

  @Input() showSearch: boolean = false;
  showNbHeader2: boolean;
  showNbHeader3: boolean;
  selectedPageName: string;

  @ViewChild('webHeader') private _webHeader: ElementRef;
  public firstLevelNav: NavigationItem[];
  public secondLevelNav: NavigationItem[];
  public slideImages: string[];
  public currentUser: CurrentUserDisplay = null;
  public resetPasswordId: string;
  public resetPasswordToken: string;
  public slideOptions = { initialSlide: 1, speed: 400, };
  private _optionsPopover: HTMLIonPopoverElement;
  private _lastHeight: number;

  
  constructor(private _router: Router, private animationCtrl: AnimationController,
    private _nbRouter: NbRoutingService, public modalController: ModalController,
    private _popoverController: PopoverController, private _modalService: ModalService,
    private _route: ActivatedRoute, private _accountsService: AccountsService,
    private _headerGuard: HeaderGuard, private _platform: Platform) {
    this._headerGuard.headerDisplaySubject.subscribe((headerDisplay: HeaderDisplay) => {
      if(headerDisplay) {
        this.selectedPageName = headerDisplay.selectedPageName;
        this.showNbHeader2 = headerDisplay.showNbHeader2;
        this.showNbHeader3 = headerDisplay.showNbHeader3;
      }
    });
    
    this._loadNav();
    this._accountsService.currentUserSubject.subscribe((user: CurrentUserDisplay) => {
      this.currentUser = user;       
    });
  }


  ngDoCheck() {
    // NOTE: `el` DOES exist on the `this._webHeader` var
    if(this._webHeader && (this._lastHeight !== this._webHeader['el'].offsetHeight)) {
      this._lastHeight = this._webHeader['el'].offsetHeight;
      this.headerHeight.emit(this._webHeader['el'].offsetHeight);      
    }
  }

  ngOnInit() {
    this._route.queryParamMap
      .subscribe((params) => {
        
        const shouldLogin = params.get('login-required');
      }
    );
  }
  public goToPage(href: string) {
    this._router.navigateByUrl(href);
  }

  public goToProfile() {
    this._router.navigateByUrl('/vendor-profile');
  }

  public browseCategory(category: string) {
    this._nbRouter.goToVendorListByCategory(category);
  }


  async presentUserSettings(event) {   
    const settingsPopover = await this._popoverController.create({
      component: UserSettingsPopoverComponent,
      showBackdrop: false,
      event,
      translucent: true,
    });

    await settingsPopover.present(); 
  }
  

  private _loadNav() {
    this.secondLevelNav = Object.keys(CommunityTypes).map(community => ({ name: CommunityTypes[community], href: '' }))
    this.firstLevelNav = [
      {
        name: 'Home',
        href: '/home'
      },
      {
        name: 'Feed',
        href: '/feed'
      },
      {
        name: 'Get Started',
        href: '/get-started'
      },
      {
        name: 'Pricing',
        href: '/pricing'
      },
      // {
      //   name: 'Support',
      //   href: ''
      // }
    ];

    if (this._platform.is("capacitor")) {
      this.firstLevelNav = this.firstLevelNav.filter(x => x.name !== 'Pricing');
    }
  }

  async showLocationModal() {
    await this._modalService.displayLocationModal();
  }
}
