import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TEntriesComponent } from './t-entries.component';

describe('TEntriesComponent', () => {
  let component: TEntriesComponent;
  let fixture: ComponentFixture<TEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TEntriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
