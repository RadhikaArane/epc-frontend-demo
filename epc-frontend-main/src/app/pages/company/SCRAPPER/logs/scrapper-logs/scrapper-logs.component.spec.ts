import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapperLogsComponent } from './scrapper-logs.component';

describe('ScrapperLogsComponent', () => {
  let component: ScrapperLogsComponent;
  let fixture: ComponentFixture<ScrapperLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrapperLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrapperLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
