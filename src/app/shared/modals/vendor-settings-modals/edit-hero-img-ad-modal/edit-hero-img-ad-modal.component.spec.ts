import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditHeroImgAdModalComponent } from './edit-hero-img-ad-modal.component';

describe('EditHeroImgAdModalComponent', () => {
  let component: EditHeroImgAdModalComponent;
  let fixture: ComponentFixture<EditHeroImgAdModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHeroImgAdModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditHeroImgAdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
