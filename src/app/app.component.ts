import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { AccountsService } from './services/accounts.service';
import { HeaderGuard } from './guards/header.guard';
import { HeaderDisplay } from './models/header-display';
import { CommunityCategory } from './models/community-category';
import { NotificationsService } from './services/notifications.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { AuthService } from './auth/auth.service';

import { Analytics, getAnalytics, logEvent } from "firebase/analytics";
import { LociConstants } from './models/constants';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public appPages: any[];
  public selectedIndex = 0;
  public selectedPageName: string;
  public communities: CommunityCategory[];
  public showPricing = false;
  lociConstants = LociConstants;
  constructor(
    
    private _accountService: AccountsService, // keep this here, please (it is to initialize the AccountsService early)
    private _notificationsService: NotificationsService, // keep this here, please (it is to initialize the NotificationsService early)
    private _platform: Platform, private _statusBar: StatusBar, private _authService: AuthService,
    private _headerGuard: HeaderGuard) {
      this._headerGuard.headerDisplaySubject.subscribe((headerDisplay: HeaderDisplay) => {
        if(headerDisplay) {
          this.selectedPageName = headerDisplay.selectedPageName;
        }
      });
    
      if (!this._platform.is("capacitor")) {
        this.showPricing = true;
      }

    this.initializeApp();
  }

  refresh() {
    window.location.reload();
  }
  
  ngAfterViewInit() {
   
  }

  initializeApp() {
    this._platform.ready().then(() => {
      this._statusBar.styleDefault();
      SplashScreen.hide();
    });
  }

  ngOnInit() {
  }


  
  
}
