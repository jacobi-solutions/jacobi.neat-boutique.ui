import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { JacobiAuthFlowPage } from './auth-flow.page';

describe('JacobiAuthFlowPage', () => {
  let component: JacobiAuthFlowPage;
  let fixture: ComponentFixture<JacobiAuthFlowPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JacobiAuthFlowPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(JacobiAuthFlowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
