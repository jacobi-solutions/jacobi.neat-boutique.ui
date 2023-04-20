import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChooseAnswerRankingModalComponent } from './choose-answer-ranking-modal.component';

describe('ChooseAnswerRankingModalComponent', () => {
  let component: ChooseAnswerRankingModalComponent;
  let fixture: ComponentFixture<ChooseAnswerRankingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseAnswerRankingModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseAnswerRankingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
