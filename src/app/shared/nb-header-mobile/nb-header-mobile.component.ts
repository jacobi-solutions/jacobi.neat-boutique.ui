import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { HeaderDisplay } from 'src/app/models/header-display';
import { AccountsService } from 'src/app/services/accounts.service';
import { HeaderGuard } from 'src/app/guards/header.guard';
import { UserSettingsPopoverComponent } from '../popovers/user-settings-popover/user-settings-popover.component';
import { PopoverController } from '@ionic/angular';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-nb-header-mobile',
  templateUrl: './nb-header-mobile.component.html',
  styleUrls: ['./nb-header-mobile.component.scss'],
})
export class NbHeaderMobileComponent implements OnInit {
  pageName: string;

  public currentUser: CurrentUserDisplay = null;
  constructor(private _customersService: AccountsService, private _modalService: ModalService,
    private _router: Router, private _popoverController: PopoverController,
    private _headerGuard: HeaderGuard) { 
    this._headerGuard.headerDisplaySubject.subscribe((headerDisplay: HeaderDisplay) => {
      if(headerDisplay) {
        this.pageName = headerDisplay.selectedPageName;
      }
    });


  }

  ngOnInit() {
    this._customersService.currentUserSubject.subscribe(user => {
      this.currentUser = user;            
  });
  }

goBack() {
  history.back();
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

 goTo(localRout: string) {
  this._router.navigateByUrl(localRout);
 }

 async showLocationModal() {
  await this._modalService.displayLocationModal();
}
}
