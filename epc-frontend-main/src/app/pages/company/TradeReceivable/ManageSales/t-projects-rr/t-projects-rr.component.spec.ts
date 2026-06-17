import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TProjectsRrComponent } from './t-projects-rr.component';

describe('TProjectsRrComponent', () => {
  let component: TProjectsRrComponent;
  let fixture: ComponentFixture<TProjectsRrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TProjectsRrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TProjectsRrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
