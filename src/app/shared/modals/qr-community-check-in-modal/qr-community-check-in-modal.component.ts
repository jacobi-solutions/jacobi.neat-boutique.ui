import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr-community-check-in-modal',
  templateUrl: './qr-community-check-in-modal.component.html',
  styleUrls: ['./qr-community-check-in-modal.component.scss'],
})
export class QrCommunityCheckInModalComponent implements OnInit {
  @Input() networkId: string;
  @Input() networkName: string;

  public qrCodeData: string;

  constructor(private _modalController: ModalController) {}

  ngOnInit() {
    this.qrCodeData = `${environment.lociUIBaseUrl}/checkin/community/${this.networkId}`;
  }

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

  onClose() {
    this._modalController.dismiss({
      dismissed: true,
    });
  }
}
