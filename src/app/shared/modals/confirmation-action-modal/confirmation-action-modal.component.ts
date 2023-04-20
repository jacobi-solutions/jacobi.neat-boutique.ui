import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirmation-action-modal',
  templateUrl: './confirmation-action-modal.component.html',
  styleUrls: ['./confirmation-action-modal.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})

export class ConfirmationActionModalComponent implements OnInit {
  @Input() showCancel: boolean = true;
  @Input() confirmationInnerHTML: string;
  @Input() confirmButton: {label: string, callback: Function};

  constructor(private _modalController: ModalController) {}

  ngOnInit() {}

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
  
  async onConfirm() {
    await this.confirmButton.callback();
  }
}
