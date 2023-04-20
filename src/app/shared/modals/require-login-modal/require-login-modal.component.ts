import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-require-login-modal',
  templateUrl: './require-login-modal.component.html',
  styleUrls: ['./require-login-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class RequireLoginModalComponent implements OnInit {
  
  constructor(private _router: Router, private _modalController: ModalController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    const modalCardHeight = document.querySelector('.modal-card-wrapper')?.clientHeight;
    const modalCardWidth = document.querySelector('.modal-card-wrapper')?.clientWidth;
    document.documentElement.style.setProperty('--current-modal-card-height', `${modalCardHeight}px`);
    document.documentElement.style.setProperty('--current-modal-card-width', `${modalCardWidth}px`);
  }

  onClose(event) {
    this._modalController.dismiss({
      dismissed: true,
      event,
    });
  }

  goToSignIn() {
    this._router.navigate(['/auth-flow/sign-in']);
    this._modalController.dismiss({
      dismissed: true,
    });
  }

  goToSignUp() {
    this._router.navigate(['/auth-flow/sign-up']);
    this._modalController.dismiss({
      dismissed: true,
    });
  }
}
