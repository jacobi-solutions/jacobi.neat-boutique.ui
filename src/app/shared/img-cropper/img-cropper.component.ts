import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Cropper from "cropperjs";

@Component({
  selector: 'app-img-cropper',
  templateUrl: './img-cropper.component.html',
  styleUrls: ['./img-cropper.component.scss'],
})
export class ImgCropperComponent implements OnInit {
  @ViewChild("referenceImage", { static: false }) referenceImageElement: ElementRef;
  public imageSource: string;
  public croppedImagePreview: string = '';
  private _cropper: Cropper;

  constructor() {}

  ngOnInit() {}

  selectImg(event) {
    let formData = new FormData();
    let files: FileList;
    files = event.target?.files;

    if (files && files.length > 0) {
      formData.append('vendor-photo', files[0], files[0].name);
      const reader = new FileReader();
      // define how logo file should be processed
      reader.onload = (e: any) => {
        
        const fileType = files[0].type;
        const image = new Image();
        image.src = e.target.result;
        this.imageSource = image.src;

        if (fileType.includes('application')) {
          // bad file type
        }

        image.onload = (rs: any) => {
          // remove old crop canvas elements
          const componentWrapper = document.querySelector('.image-cropper-jJLH8n2M64jnkqma2pz8KXfG4ytkAM2e');
          Array.from(<HTMLCollection>componentWrapper.children).forEach(childNode => {
            const { classList } = childNode;
            if(classList.contains('cropper-container') && classList.contains('cropper-bg')) {
              childNode.remove();
            }
          });
          // create new cropper
          this._cropper = new Cropper(this.referenceImageElement?.nativeElement, {
            zoomable: false,
            scalable: false,
            autoCrop: true,
            aspectRatio: 2 / 1,
            crop: () => {
              const canvas = this._cropper.getCroppedCanvas();
              this.croppedImagePreview = canvas.toDataURL();
              this._cropper.setCropBoxData({
                width: 300,
                height: 100,
              })
            }
          });
          // change the image to uploaded file
          
          this._cropper.replace(image.src);
        };
      };
      // process file
      reader.readAsDataURL(files[0]);
    }
  }

}
