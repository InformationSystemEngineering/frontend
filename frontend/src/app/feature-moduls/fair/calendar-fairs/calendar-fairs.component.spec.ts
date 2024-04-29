import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarFairsComponent } from './calendar-fairs.component';

describe('CalendarFairsComponent', () => {
  let component: CalendarFairsComponent;
  let fixture: ComponentFixture<CalendarFairsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarFairsComponent]
    });
    fixture = TestBed.createComponent(CalendarFairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
