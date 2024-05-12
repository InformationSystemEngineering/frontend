import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitFairsComponent } from './visit-fairs.component';

describe('VisitFairsComponent', () => {
  let component: VisitFairsComponent;
  let fixture: ComponentFixture<VisitFairsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitFairsComponent]
    });
    fixture = TestBed.createComponent(VisitFairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
