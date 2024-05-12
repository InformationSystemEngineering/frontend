import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishFairsComponent } from './publish-fairs.component';

describe('PublishFairsComponent', () => {
  let component: PublishFairsComponent;
  let fixture: ComponentFixture<PublishFairsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishFairsComponent]
    });
    fixture = TestBed.createComponent(PublishFairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
