import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTodoAddEditComponent } from './master-todo-add-edit.component';

describe('MasterTodoAddComponent', () => {
  let component: MasterTodoAddEditComponent;
  let fixture: ComponentFixture<MasterTodoAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterTodoAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTodoAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
