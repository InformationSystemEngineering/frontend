import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFairsComponent } from './all-fairs.component';

describe('AllFairsComponent', () => {
  let component: AllFairsComponent;
  let fixture: ComponentFixture<AllFairsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllFairsComponent]
    });
    fixture = TestBed.createComponent(AllFairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
