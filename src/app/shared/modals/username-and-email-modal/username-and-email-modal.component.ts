import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CurrentUserDisplay } from 'src/app/models/current-user-display';
import { VendorProfile } from 'src/app/services/neat-boutique-api.service';

@Component({
  selector: 'app-username-and-email-modal',
  templateUrl: './username-and-email-modal.component.html',
  styleUrls: ['./username-and-email-modal.component.scss'],
})
export class UsernameAndEmailModalComponent implements OnInit {
  @Input() currentUser: CurrentUserDisplay;
  public maxUsernameLength = 15;
  public minUsernameLength = 3;
  
  public usernameForm = new FormGroup({
    username: new FormControl('', [ Validators.required, Validators.minLength(this.minUsernameLength), Validators.maxLength(this.maxUsernameLength) ])
  });

  public emailForm = new FormGroup({
    email: new FormControl('', [ Validators.email ]),
  });

  constructor(private _modalController: ModalController) {}

  ngOnInit() {
    
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
      usernmae: null
    });
  }

  onSave() {
    if(!this.usernameForm.valid) {
      this.usernameForm.markAllAsTouched();
    } else {
      this._modalController.dismiss({
        dismissed: true,
        usernmae: this.usernameForm.controls.username.value
      });
    }
  }

}
