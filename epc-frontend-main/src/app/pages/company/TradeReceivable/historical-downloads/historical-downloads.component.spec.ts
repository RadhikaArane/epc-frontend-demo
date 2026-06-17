import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalDownloadsComponent } from './historical-downloads.component';

describe('HistoricalDownloadsComponent', () => {
  let component: HistoricalDownloadsComponent;
  let fixture: ComponentFixture<HistoricalDownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalDownloadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricalDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
