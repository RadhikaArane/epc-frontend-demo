import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TSalesNov2025Component } from './t-sales-nov2025.component';

describe('TSalesNov2025Component', () => {
  let component: TSalesNov2025Component;
  let fixture: ComponentFixture<TSalesNov2025Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TSalesNov2025Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TSalesNov2025Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
