import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpcLoaderComponent } from './epc-loader.component';

describe('EpcLoaderComponent', () => {
  let component: EpcLoaderComponent;
  let fixture: ComponentFixture<EpcLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpcLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpcLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
