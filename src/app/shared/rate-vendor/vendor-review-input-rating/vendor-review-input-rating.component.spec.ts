import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorReviewInputRatingComponent } from './vendor-review-input-rating.component';

describe('VendorReviewInputRatingComponent', () => {
  let component: VendorReviewInputRatingComponent;
  let fixture: ComponentFixture<VendorReviewInputRatingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorReviewInputRatingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorReviewInputRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
