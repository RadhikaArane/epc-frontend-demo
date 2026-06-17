import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbUploadsComponent } from './pb-uploads.component';

describe('PbUploadsComponent', () => {
  let component: PbUploadsComponent;
  let fixture: ComponentFixture<PbUploadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbUploadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
