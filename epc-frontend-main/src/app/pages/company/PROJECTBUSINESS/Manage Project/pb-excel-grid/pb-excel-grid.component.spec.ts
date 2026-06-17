import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbExcelGridComponent } from './pb-excel-grid.component';

describe('PbExcelGridComponent', () => {
  let component: PbExcelGridComponent;
  let fixture: ComponentFixture<PbExcelGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbExcelGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbExcelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
