import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReviewDisplay } from 'src/app/models/review-display';
import { VendorDisplay } from 'src/app/models/vendor-display';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss'],
})
export class ReviewListComponent implements OnInit {

  @Input() reviews: ReviewDisplay[];
  @Output() onReviewDelete: EventEmitter<boolean> =  new EventEmitter<boolean>(null);
  constructor() { }

  ngOnInit() {
    
  }
  
  onDeletedReview(didDelete: boolean) {
    this.onReviewDelete.emit(didDelete);
  }
}
