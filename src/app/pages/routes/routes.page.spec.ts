import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoutesPage } from './routes.page';

describe('RoutesPage', () => {
  let component: RoutesPage;
  let fixture: ComponentFixture<RoutesPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(RoutesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
