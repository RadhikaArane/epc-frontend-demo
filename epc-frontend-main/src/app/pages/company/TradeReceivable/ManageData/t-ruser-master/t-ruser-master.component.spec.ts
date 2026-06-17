import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TRUserMasterComponent } from './t-ruser-master.component';

describe('TRUserMasterComponent', () => {
  let component: TRUserMasterComponent;
  let fixture: ComponentFixture<TRUserMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TRUserMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TRUserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
