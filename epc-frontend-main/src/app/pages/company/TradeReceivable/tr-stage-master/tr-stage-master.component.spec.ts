import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrStageMasterComponent } from './tr-stage-master.component';

describe('TrStageMasterComponent', () => {
  let component: TrStageMasterComponent;
  let fixture: ComponentFixture<TrStageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrStageMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrStageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
