import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summed-rating',
  templateUrl: './summed-rating.component.html',
  styleUrls: ['./summed-rating.component.scss'],
})
export class SummedRatingComponent implements OnInit {

  @Input() totalRating: number;
  @Input() numberOfReviews: number = 1;
  @Input() displayFlex: boolean = true;
  @Input() altStyle: string;
  public summedRating: number;
  public ratingIcons: string[];
  private _bestPossibleScore: number = 5;

  constructor() { }

  ngOnInit() {
    this._reviewSummary();
  }

  private _reviewSummary() {
    const sumToPercent = (this.totalRating / (this._bestPossibleScore * this.numberOfReviews));
    this.summedRating = (sumToPercent * this._bestPossibleScore);
    this._mapReviewIconDisplay();
  }

  private _mapReviewIconDisplay() {
    const filled = Math.floor(this.summedRating);
    const partialFill = this.summedRating - filled;
    const min_partialThreshold = 0.35;

    this.ratingIcons = [...new Array(this._bestPossibleScore)].map((el, i) => {
      if(i+1 <= filled) {
        return 'star';
      } else if((i+1 === filled+1) && (partialFill >= min_partialThreshold)) {
        return 'star-half';
      } else if(i+1 > filled) {
        return 'star-outline';
      }
    });    
  }
  
}
