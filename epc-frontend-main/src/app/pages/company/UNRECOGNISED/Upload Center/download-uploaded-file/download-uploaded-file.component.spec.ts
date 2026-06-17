import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadUploadedFileComponent } from './download-uploaded-file.component';

describe('DownloadUploadedFileComponent', () => {
  let component: DownloadUploadedFileComponent;
  let fixture: ComponentFixture<DownloadUploadedFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadUploadedFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadUploadedFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
