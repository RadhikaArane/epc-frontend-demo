import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrManualUploadComponent } from './scr-manual-upload.component';

describe('ScrManualUploadComponent', () => {
  let component: ScrManualUploadComponent;
  let fixture: ComponentFixture<ScrManualUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrManualUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrManualUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
