import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaScannedHistoryComponent } from './fa-scanned-history.component';

describe('FaScannedHistoryComponent', () => {
  let component: FaScannedHistoryComponent;
  let fixture: ComponentFixture<FaScannedHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaScannedHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaScannedHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
