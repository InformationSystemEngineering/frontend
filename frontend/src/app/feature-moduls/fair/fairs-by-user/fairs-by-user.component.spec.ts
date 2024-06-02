import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairsByUserComponent } from './fairs-by-user.component';

describe('FairsByUserComponent', () => {
  let component: FairsByUserComponent;
  let fixture: ComponentFixture<FairsByUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FairsByUserComponent]
    });
    fixture = TestBed.createComponent(FairsByUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
