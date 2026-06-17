import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrQueryDataComponent } from './tr-query-data.component';

describe('TrQueryDataComponent', () => {
  let component: TrQueryDataComponent;
  let fixture: ComponentFixture<TrQueryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrQueryDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrQueryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
