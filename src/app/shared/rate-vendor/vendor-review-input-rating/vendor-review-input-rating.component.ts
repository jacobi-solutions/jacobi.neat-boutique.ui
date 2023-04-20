import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Gesture, GestureController } from '@ionic/angular';

@Component({
  selector: 'app-vendor-review-input-rating',
  templateUrl: './vendor-review-input-rating.component.html',
  styleUrls: ['./vendor-review-input-rating.component.scss'],
})
export class VendorReviewInputRatingComponent implements OnInit {

  @Output() ratingValue: EventEmitter<number> = new EventEmitter();
  @Input() formGroupInstance: UntypedFormGroup;
  @Input() inputName: string;
  @ViewChild('rating') ratingInput: ElementRef;
  @Input() altSize: string;
  
  public inputRating: number;
  public ratingIcons: string[];
  private _summedRating: number;
  private _maxPossibleRating: number = 5;
  private _ratingScore: number;
  
  constructor(private _gestureCtrl: GestureController) { }

  ngOnInit() {
    // form was reset or no rating chosen
    if(!this.formGroupInstance.value[this.inputName]) {
      this.formGroupInstance.patchValue({ [this.inputName]: 0 });
    }

    const initRating = this.formGroupInstance.value[this.inputName];
    this._ratingScore = initRating;
    this._summedRating = initRating;
    this.inputRating = initRating;
    this._mapReviewIconDisplay();    
  }

  ngAfterViewInit() {
    const gesture: Gesture = this._gestureCtrl.create({
      el: this.ratingInput.nativeElement,
      threshold: 10,
      gestureName: 'my-gesture',
      onMove: (ev) => this.changeRatingWithDrag(ev)
    }, true);

    gesture.enable();
  }

  
  scoreClick(rating) {
    this._ratingScore = rating;
    this._summedRating = rating;
    this.inputRating = rating;
    this._mapReviewIconDisplay();
  }


  changeRatingWithDrag(dragEvent) {
    const { currentX } = dragEvent;
    const rect = this.ratingInput.nativeElement.getBoundingClientRect();
    this._ratingScore = 0.5;
    const { left, right } = rect;
    if(currentX > right) {
      // 5 stars
      this._ratingScore = 5;
    } else if(currentX < left) {
      // 0 stars 
      this._ratingScore = 0.5;
    } else {
      // somewhere between 0.5 and 5 stars 
      this._ratingScore = (currentX - left) / (right - left);

      // force min rating to be 0.5 stars
      if(this._ratingScore < 0.1) {
        this._ratingScore = 0.1;
      }
    }
    this._reviewSummary();
  }

    
  private _reviewSummary() {
    const starPercent = (100 / this._maxPossibleRating) / 100;
    this._summedRating = this._ratingScore / starPercent;
    this._mapReviewIconDisplay();
  }

  private _mapReviewIconDisplay() {
    const filled = Math.floor(this._summedRating);
    const partialFill = this._summedRating - filled;
    const min_partialThreshold = 0.25;

    this.ratingIcons = [...new Array(this._maxPossibleRating)].map((el, i) => {
      if(i+1 <= filled) {
        return 'star';
      } else if((i+1 === filled+1) && (partialFill >= min_partialThreshold)) {
        return 'star-half';
      } else if(i+1 > filled) {
        return 'star-outline';
      }
    });
    this._scoreValue();
  }

  private _scoreValue() {
    let newScore = 0;
    this.ratingIcons.forEach(icon => {
      switch(icon) {
        case 'star':
          newScore += 1;
          break;
        case 'star-half':
          newScore += 0.5;
          break;
        default:
          // do nothing
      }
    });
    // send clean score value back to parent 
    if(newScore < 0.5) {
      newScore = 0.5;
    } else if(newScore > 5) {
      newScore = 5;
    }

    this.inputRating = newScore;
    this.ratingValue.emit(newScore);
  }
}


