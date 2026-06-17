import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrUploadSapFilesComponent } from './tr-upload-sap-files.component';

describe('TrUploadSapFilesComponent', () => {
  let component: TrUploadSapFilesComponent;
  let fixture: ComponentFixture<TrUploadSapFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrUploadSapFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrUploadSapFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
