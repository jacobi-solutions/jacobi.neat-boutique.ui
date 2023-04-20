import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditSocialMediaLinksModalComponent } from './edit-social-media-links-modal.component';

describe('EditSocialMediaLinksModalComponent', () => {
  let component: EditSocialMediaLinksModalComponent;
  let fixture: ComponentFixture<EditSocialMediaLinksModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSocialMediaLinksModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditSocialMediaLinksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
