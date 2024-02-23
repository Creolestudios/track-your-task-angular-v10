import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAssignComponent } from './my-assign.component';

describe('MyAssignComponent', () => {
  let component: MyAssignComponent;
  let fixture: ComponentFixture<MyAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
