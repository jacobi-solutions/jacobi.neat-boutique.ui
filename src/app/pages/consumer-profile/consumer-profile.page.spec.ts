import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConsumerProfilePage } from './consumer-profile.page';

describe('ConsumerProfilePage', () => {
  let component: ConsumerProfilePage;
  let fixture: ComponentFixture<ConsumerProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
