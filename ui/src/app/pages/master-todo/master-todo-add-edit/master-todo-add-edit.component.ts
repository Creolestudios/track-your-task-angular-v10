import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoTaskService } from '../../../_services/todo-task.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { DataService } from '../../../_services/data.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Subscription } from 'rxjs';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-master-todo-add-edit',
  templateUrl: './master-todo-add-edit.component.html',
  styleUrls: ['./master-todo-add-edit.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class MasterTodoAddEditComponent implements OnInit, OnDestroy {
  AddMasterTaskForm: FormGroup;
  EditMasterTaskForm: FormGroup;
  userErrorMsg: string
  groupMemberData: any;
  submitted = false;
  taskUpdateSubmitted = false;
  loadingBtn = false;
  editTaskComponent = false
  AddTaskComponent = false;
  FrequencydataList: Array<any> = [];
  masterTaskData: any = [];
  checkAssignUserValue: any;
  minDate = new Date(Date.now() + (3600 * 1000 * 24))
  private masterSubscription$: Subscription;
  taskId: any
  html = "";
  config = {
    height: 130,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'undo redo | formatselect | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat',
  };
  dueDays: string;
  editDueDays: string;
  constructor(
    private todoTaskService: TodoTaskService,
    public datepipe: DatePipe,
    private dataService: DataService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {

    this.FrequencydataList = [
      { id: 1, name: "Daily" },
      { id: 2, name: "Weekly" },
      { id: 3, name: "Monthly" }
    ]
    this.masterSubscription$ = this.dataService.getTaskId().subscribe(data => {
      this.AddTaskComponent = true;
      this.editTaskComponent = false
      this.taskId = data.taskId;
      if (data.editTask == true) {
        if (this.taskId != undefined || this.taskId != null) {
          this.getTaskDetails(this.taskId);
        } else {
         
          return false;
        }
      } else {
        this.AddMasterTaskForm.reset();
        this.submitted = false;
        this.dueDays = "";
        this.AddTaskComponent = true;
        this.getTaskDetails(this.taskId);
        return false;

      }
    })
    this.dataService.getGroupUserData().subscribe(data => {
      this.groupMemberData = data.data;
      this.AddTaskComponent = data.addTaskFrom
      this.editTaskComponent = false
    })

    this.dataService.getTaskId().subscribe(data => {
      if(data.editTask == false) {
        this.AddTaskComponent = true;
      }
    })
  }

  ngOnInit(): void {
    // this.AddTaskComponent = false;
    this.EditMasterTaskForm = this.fb.group({
      taskAssignTo: [null],
      dueDay: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      recurringEndDate: ['']
    });

    this.AddMasterTaskForm = this.fb.group({
      taskAssignTo: [null],
      dueDay: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      frequency: [null, [Validators.required]],
      recurringEndDate: ['']
    });


  }



  get g() { return this.AddMasterTaskForm.controls; }
  saveMasterTask(AddMasterTaskForm) {
    let masterGroupId = localStorage.getItem('masterGroupId');
    
    this.submitted = true;
    if (this.AddMasterTaskForm.value.dueDay == "" || this.AddMasterTaskForm.value.dueDay == null) {
      this.dueDays = "Due days in numbers is required";
      return;
    }
    if ((AddMasterTaskForm.value.dueDay) > 365) {
      return
    }
    if (this.AddMasterTaskForm.invalid) {
      return;
    }

    let recurringEndDate = this.datepipe.transform(AddMasterTaskForm.value.recurringEndDate, 'yyyy-MM-dd');
    let createData = {
      groupId: masterGroupId,
      taskDescription: AddMasterTaskForm.value.taskDescription,
      taskAssignTo: AddMasterTaskForm.value.taskAssignTo,
      frequency: AddMasterTaskForm.value.frequency,
      recurringEndDate: recurringEndDate,
      dueDay: AddMasterTaskForm.value.dueDay,
      taskStatus: ""
    }
    if (AddMasterTaskForm.value.taskDescription == "" || AddMasterTaskForm.value.taskDescription == null
      || AddMasterTaskForm.value.frequency == null || AddMasterTaskForm.value.frequency == "" || AddMasterTaskForm.value.dueDay == "" || AddMasterTaskForm.value.dueDay == null) {
      return false;
    }
    if (masterGroupId == null || masterGroupId == undefined) {
      this.userErrorMsg = "Please select group";
      setTimeout(() => {
        this.userErrorMsg = "";
      }, 3000);
      return false;
    } else {
      this.userErrorMsg = '';
    }
    this.loadingBtn = true;
    this.todoTaskService.addMasterTask(createData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          let masterGroupId = localStorage.getItem('masterGroupId');
          let masterGroupName = localStorage.getItem('masterGroupName');
          this.loadingBtn = false;
          let body = {
            groupName: masterGroupName,
            groupId: masterGroupId
          }
          this.dataService.setSessionData({
            sessionData: body
          });
          this.AddMasterTaskForm.reset();
          this.submitted = false;
          this.dueDays = "";
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
  }

  public currenTask;
  getTaskDetails(masterTaskId) {
    this.currenTask = masterTaskId ? masterTaskId : localStorage.getItem('masterTaskId');
    if (masterTaskId != null || masterTaskId != undefined) {
      this.editTaskComponent = true;
      this.AddTaskComponent = false;
      this.dueDays = "";
      this.submitted = false;
    } else {
      this.editTaskComponent = false;
      this.AddTaskComponent = true;
    }
    if (masterTaskId != null || masterTaskId != undefined) {
      this.todoTaskService.getMasterTask(masterTaskId).subscribe((res) => {
        this.masterTaskData = res;
        if (this.groupMemberData == undefined) {
        } else {
          this.groupMemberData;
          for (let i = 0; i < this.groupMemberData.length; i++) {
            if (this.masterTaskData.taskAssignTo === this.groupMemberData[i].userId) {
              this.checkAssignUserValue = this.masterTaskData.taskAssignTo; break;
            } else {
              this.checkAssignUserValue = null;
            }
          }
          if (this.checkAssignUserValue == null) {
            let EditData = {
              dueDay: this.masterTaskData.dueDay,
              taskDescription: this.masterTaskData.taskDescription,
              taskAssignTo: this.checkAssignUserValue,
              taskDueDate: this.masterTaskData.taskDueDate,
              frequency: this.masterTaskData.frequency,
              recurringEndDate: this.masterTaskData.recurringEndDate
            }
            this.EditMasterTaskForm.patchValue(EditData);
          } else {
            let EditData = {
              dueDay: this.masterTaskData.dueDay,
              taskDescription: this.masterTaskData.taskDescription,
              taskAssignTo: this.checkAssignUserValue,
              taskDueDate: this.masterTaskData.taskDueDate,
              frequency: this.masterTaskData.frequency,
              recurringEndDate: this.masterTaskData.recurringEndDate
            }
            this.EditMasterTaskForm.patchValue(EditData);
          }
        }
      }, (error) => {
        this.toastr.error('Error', error);
        // if ((error) === "Token Expired") {
        //   this.router.navigate(['/']);
        // }
      });
    }
  }
  onDueDaysEvent(event) {
    if (event.target.value != "") {
      if ((event.target.value) > 365) {
        this.dueDays = "Due days should not greater than 365 days";
        return
      } else {
        this.dueDays = "";
      }
    } else {
      this.dueDays = "Due days in numbers is required";
    }
  }

  onEditDueDaysEvent(event) {
    if (event.target.value != "") {
      if ((event.target.value) > 365) {
        this.editDueDays = "Due days should not greater than 365 days";
        return
      } else {
        this.editDueDays = "";
      }
    } else {
      this.editDueDays = "Due days in numbers is required";
    }
  }

  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }

  editTaskCancel() {
    this.AddTaskComponent = true;
    this.editTaskComponent = false;
    this.AddMasterTaskForm.reset();
    this.submitted = false;
    this.taskUpdateSubmitted = false;
    this.EditMasterTaskForm.reset();
  }

  addFormClear() {
    this.AddMasterTaskForm.reset();
    this.submitted = false;
    this.dueDays = "";
  }

  get m() { return this.EditMasterTaskForm.controls; }
  updateMasterTask(EditMasterTaskForm) {
    let masterTaskId = localStorage.getItem('masterTaskId');
    let masterGroupId = localStorage.getItem('masterGroupId');
    this.taskUpdateSubmitted = true;
    if (this.EditMasterTaskForm.value.dueDay == "" || this.EditMasterTaskForm.value.dueDay == null) {
      this.editDueDays = "Due days in numbers is required";
      return;
    } else {
      this.editDueDays = "";
    }
    if ((this.EditMasterTaskForm.value.dueDay) > 365) {
      return
    }
    let recurringEndDate = this.datepipe.transform(EditMasterTaskForm.value.recurringEndDate, 'yyyy-MM-dd');
    let createData = {
      groupId: masterGroupId,
      taskDescription: EditMasterTaskForm.value.taskDescription,
      taskAssignTo: EditMasterTaskForm.value.taskAssignTo,
      frequency: EditMasterTaskForm.value.frequency,
      recurringEndDate: recurringEndDate,
      dueDay: EditMasterTaskForm.value.dueDay,
      taskStatus: ""
    }

    if (EditMasterTaskForm.value.taskDescription == "" || EditMasterTaskForm.value.taskDescription == null ||
      EditMasterTaskForm.value.frequency == null || EditMasterTaskForm.value.frequency == ""
      || EditMasterTaskForm.value.dueDay == null || EditMasterTaskForm.value.dueDay == "") {
      return false;
    }

    this.todoTaskService.updateMasterTask(masterTaskId, createData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          let masterGroupId = localStorage.getItem('masterGroupId');
          let masterGroupName = localStorage.getItem('masterGroupName');
          let body = {
            groupName: masterGroupName,
            groupId: masterGroupId
          }
          this.dataService.setSessionData({
            sessionData: body
          });
          this.AddMasterTaskForm.reset();
          this.taskUpdateSubmitted = false;
          this.editTaskComponent = true;
          this.AddTaskComponent = false;
          this.dueDays = "";
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
  }
  public ngOnDestroy(): void {
    // this.masterSubscription$.unsubscribe();
    // this.dataService.setTaskId(null)
  }
}
