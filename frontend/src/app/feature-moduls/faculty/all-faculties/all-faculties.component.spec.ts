import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFacultiesComponent } from './all-faculties.component';

describe('AllFacultiesComponent', () => {
  let component: AllFacultiesComponent;
  let fixture: ComponentFixture<AllFacultiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllFacultiesComponent]
    });
    fixture = TestBed.createComponent(AllFacultiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
