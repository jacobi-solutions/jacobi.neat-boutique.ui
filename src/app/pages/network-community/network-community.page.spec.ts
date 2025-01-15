import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NetworkCommunityPage } from './network-community.page';

describe('NetworkCommunityPage', () => {
  let component: NetworkCommunityPage;
  let fixture: ComponentFixture<NetworkCommunityPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(NetworkCommunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
