import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrAuditLogsComponent } from './ur-audit-logs.component';

describe('UrAuditLogsComponent', () => {
  let component: UrAuditLogsComponent;
  let fixture: ComponentFixture<UrAuditLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAuditLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrAuditLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
