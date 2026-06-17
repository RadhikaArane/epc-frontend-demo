import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrSapDumpLogComponent } from './tr-sap-dump-log.component';

describe('TrSapDumpLogComponent', () => {
  let component: TrSapDumpLogComponent;
  let fixture: ComponentFixture<TrSapDumpLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrSapDumpLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrSapDumpLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
