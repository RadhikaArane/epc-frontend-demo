import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbFtmEntriesComponent } from './pb-ftm-entries.component';

describe('PbFtmEntriesComponent', () => {
  let component: PbFtmEntriesComponent;
  let fixture: ComponentFixture<PbFtmEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbFtmEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbFtmEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
