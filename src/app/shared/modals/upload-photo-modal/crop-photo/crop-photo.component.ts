import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import Cropper from "cropperjs";
import { ImageFileEventType } from 'typings/custom-types';

@Component({
  selector: 'app-crop-photo',
  templateUrl: './crop-photo.component.html',
  styleUrls: ['./crop-photo.component.scss'],
})
export class CropPhotoComponent implements OnInit {
  @Input() isCircular: boolean;
  
  @ViewChild("referenceImage", { static: false }) referenceImageElement: ElementRef;
  @Output() fileLoadEvent: EventEmitter<ImageFileEventType> =  new EventEmitter<ImageFileEventType>(null);
  @Output() photoSrc: EventEmitter<string> =  new EventEmitter<string>(null);
  public imageSource: string;
  public loadingImg: boolean;
  public croppedImagePreview: string = '';
  private _cropper: Cropper;

  constructor() { }

  ngOnInit() {
  }


  selectImg(event) {
    let formData = new FormData();
    let files: FileList;
    files = event.target?.files;

    if (files && (files.length > 0)) {
      formData.append('photo', files[0], files[0].name);
      const reader = new FileReader();
      // define how logo file should be processed
      reader.onload = (e: any) => {
        const fileType = files[0].type;        
        if (fileType.includes('application')) {
          this.imageSource = null;
          this.croppedImagePreview = null;
          this.fileLoadEvent.emit(ImageFileEventType.WRONG_FILE_TYPE_DETECTED);
          return null;
        }

        const image = new Image();
        image.src = e.target.result;
        this.imageSource = image.src;
        this.loadingImg = true;
        this.fileLoadEvent.emit(ImageFileEventType.IMAGE_LOADING);

        image.onload = (rs: any) => {     
          if(this._cropper) {
            // remove old img
            this._cropper.destroy();
          }
          // create new cropper
          this._cropper = new Cropper(this.referenceImageElement?.nativeElement, {
            zoomable: false,
            scalable: false,
            crop: () => {              
              const canvas = this._cropper.getCroppedCanvas();
              this.croppedImagePreview = canvas.toDataURL();     
            }
          });
          // change the image to uploaded file
          this.loadingImg = false;
          cropBoxAspectRatio = 3 / 2;
          if(this.isCircular) {
            var cropBoxAspectRatio = 1;
          }
          this._cropper.setAspectRatio(cropBoxAspectRatio);
          // this._cropper.replace(image.src);
        };
      };
      // process file      
      reader.readAsDataURL(files[0]);
    }
  }


  async saveCroppedImage() {
    if(this.croppedImagePreview) {
      this._cropper.getCroppedCanvas().toBlob((blob) => {
        const formData = new FormData();
        const formKey = 'photo';
        formData.append(formKey, blob, formKey + '.png');
        
        // await this._vendorSettings.uploadVendorLogo(formData, formKey, this.croppedImagePreview);

        this.photoSrc.next(this.croppedImagePreview);
      });
    }
  }
}
