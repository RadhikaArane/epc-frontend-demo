import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrUserLogComponent } from './tr-user-log.component';

describe('TrUserLogComponent', () => {
  let component: TrUserLogComponent;
  let fixture: ComponentFixture<TrUserLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrUserLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrUserLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
