import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorSettingsPageRoutingModule } from './vendor-settings-routing.module';

import { VendorSettingsPage } from './vendor-settings.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { VendorProfilePageRoutingModule } from '../vendor-profile/vendor-profile-routing.module';
import { EditBioComponent } from './components/edit-bio/edit-bio.component';
import { EditHeaderDetailsComponent } from './components/edit-header-details/edit-header-details.component';
import { VendorPhotosComponent } from './components/vendor-photos/vendor-photos.component';
import { EditHeroAdComponent } from './components/edit-hero-ad/edit-hero-ad.component';
import { EditPollAdComponent } from './sub-routes/poll-ad/edit-poll-ad/edit-poll-ad.component';
import { PollAdPlaceholderComponent } from './components/poll-ad-placeholder/poll-ad-placeholder.component';
import { PollAdComponent } from './sub-routes/poll-ad/poll-ad.component';
import { CommunityBillboardAdComponent } from './sub-routes/community-billboard-ad/community-billboard-ad.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorSettingsPageRoutingModule,
    ReactiveFormsModule,
    VendorProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [
    VendorSettingsPage,
    EditHeaderDetailsComponent,
    EditBioComponent,
    VendorPhotosComponent,
    EditHeroAdComponent,
    EditPollAdComponent,
    PollAdPlaceholderComponent,
    PollAdComponent,
    CommunityBillboardAdComponent
  ]
})
export class VendorSettingsPageModule {}
