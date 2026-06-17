import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrAllLogsComponent } from './scr-all-logs.component';

describe('ScrAllLogsComponent', () => {
  let component: ScrAllLogsComponent;
  let fixture: ComponentFixture<ScrAllLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrAllLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrAllLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
