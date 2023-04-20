import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorRevisePage } from './vendor-revise.page';

describe('VendorRevisePage', () => {
  let component: VendorRevisePage;
  let fixture: ComponentFixture<VendorRevisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRevisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorRevisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
