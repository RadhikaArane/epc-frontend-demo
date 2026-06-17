import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrWorkingSheetComponent } from './tr-working-sheet.component';

describe('TrWorkingSheetComponent', () => {
  let component: TrWorkingSheetComponent;
  let fixture: ComponentFixture<TrWorkingSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrWorkingSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrWorkingSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
