import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTodoComponent } from './master-todo.component';

describe('MasterTodoComponent', () => {
  let component: MasterTodoComponent;
  let fixture: ComponentFixture<MasterTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
