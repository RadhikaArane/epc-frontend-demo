import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaUploaddataComponent } from './fa-uploaddata.component';

describe('FaUploaddataComponent', () => {
  let component: FaUploaddataComponent;
  let fixture: ComponentFixture<FaUploaddataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaUploaddataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaUploaddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
