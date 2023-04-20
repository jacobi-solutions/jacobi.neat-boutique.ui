import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NbHeaderComponent } from 'src/app/shared/nb-header/nb-header.component';
import { NbFooterComponent } from 'src/app/shared/nb-footer/nb-footer.component';
import { PromptComponent } from './prompt/prompt.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule
  ],
  declarations: [
    HomePage,
    PromptComponent
  ]
})
export class HomePageModule {}
