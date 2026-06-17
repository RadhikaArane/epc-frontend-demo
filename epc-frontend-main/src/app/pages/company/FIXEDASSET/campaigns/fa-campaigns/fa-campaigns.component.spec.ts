import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaCampaignsComponent } from './fa-campaigns.component';

describe('FaCampaignsComponent', () => {
  let component: FaCampaignsComponent;
  let fixture: ComponentFixture<FaCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaCampaignsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
