import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr-check-in-modal',
  templateUrl: './qr-check-in-modal.component.html',
  styleUrls: ['./qr-check-in-modal.component.scss'],
})
export class QrCheckInModalComponent implements OnInit {
  @Input() vendorId: string;
  @Input() vendorName: string;

  public qrCodeData: string;

  constructor(private _modalController: ModalController) {}

  ngOnInit() {
    // Generate QR code data with the vendorId
    this.qrCodeData = `${environment.lociUIBaseUrl}/checkin/${this.vendorId}`;
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
