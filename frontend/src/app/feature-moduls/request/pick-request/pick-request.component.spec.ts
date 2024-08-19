import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickRequestComponent } from './pick-request.component';

describe('PickRequestComponent', () => {
  let component: PickRequestComponent;
  let fixture: ComponentFixture<PickRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickRequestComponent]
    });
    fixture = TestBed.createComponent(PickRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
