import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TProjectsComponent } from './t-projects.component';

describe('TProjectsComponent', () => {
  let component: TProjectsComponent;
  let fixture: ComponentFixture<TProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
