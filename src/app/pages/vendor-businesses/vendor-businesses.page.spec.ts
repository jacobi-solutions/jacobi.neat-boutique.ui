import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VendorBusinessesPage } from './vendor-businesses.page';

describe('VendorBusinessesPage', () => {
  let component: VendorBusinessesPage;
  let fixture: ComponentFixture<VendorBusinessesPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(VendorBusinessesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
