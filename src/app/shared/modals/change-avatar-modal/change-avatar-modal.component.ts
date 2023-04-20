import { ThisReceiver } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Color } from '@ionic/core';
import { ConsumerService } from 'src/app/services/consumer.service';
import { ConsumerProfile, VendorProfile } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-change-avatar-modal',
  templateUrl: './change-avatar-modal.component.html',
  styleUrls: ['./change-avatar-modal.component.scss'],
})
export class ChangeAvatarModalComponent implements OnInit {
  @Input() profile: ConsumerProfile | VendorProfile;
  colors: string[];
  newBorderColor: string;
  constructor(private _modalController: ModalController, private _consumersService: ConsumerService) { 
    this.colors = ['#409195', '#ffbc00', '#916dd5', '#dc7730', '#93290f', '#65c2db', '#9eaebe', '#013e43'];
    
  }

  ngOnInit() {
    this.newBorderColor = this.profile.borderColor;
  }

  onClose() {
    this._modalController.dismiss({
      openPictureModal: false,
      newBorderColor: null,
      dismissed: true
    });
  }

  changeColor(color: string) {
    this.newBorderColor = color;
  }

  changePicture() {
    this._modalController.dismiss({
      openPictureModal: true,
      dismissed: true
    });
  }
  
  saveColor() {
    this._modalController.dismiss({
      openPictureModal: false,
      newBorderColor: this.newBorderColor,
      dismissed: true
    });
  }

}
