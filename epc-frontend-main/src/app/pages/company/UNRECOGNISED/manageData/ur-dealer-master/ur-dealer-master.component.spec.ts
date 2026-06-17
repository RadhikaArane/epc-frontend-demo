import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrDealerMasterComponent } from './ur-dealer-master.component';

describe('UrDealerMasterComponent', () => {
  let component: UrDealerMasterComponent;
  let fixture: ComponentFixture<UrDealerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrDealerMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrDealerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
