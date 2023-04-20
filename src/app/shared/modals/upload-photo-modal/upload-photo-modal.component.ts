import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageFileEventType } from 'typings/custom-types';

@Component({
  selector: 'app-upload-photo-modal',
  templateUrl: './upload-photo-modal.component.html',
  styleUrls: ['./upload-photo-modal.component.scss'],
})
export class UploadPhotoModalComponent implements OnInit {
  @Input() isCircular: boolean;

  public imageSource: string;
  public fileEvent: ImageFileEventType = null;
  public fileEventTypes = ImageFileEventType;
  public croppedImagePreview: string = '';

  constructor(private _modalController: ModalController) {}

  ngOnInit() {}

  fileEventChange(event) {
    this.fileEvent = event;
  }

  imgUploaded(imgBase64Path: string) {
    this._modalController.dismiss({
      dismissed: true,
      imgBase64Path,
    });
  }

  onClose() {
    this._modalController.dismiss({
      dismissed: true,
      imgBase64Path: null,
    });
  }
}