import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { LoaderService } from '../../_services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addtask-dialog',
  templateUrl: './addtask-dialog.component.html',
  styleUrls: ['./addtask-dialog.component.css']
})
export class AddtaskDialogComponent implements OnInit {
  isAnimate: true;
  loadingBtn;
  userErrorMsg;
  submitted;
  html = "";
  AddTaskForm: FormGroup;
  showMasterTaskCheckbox = false;
  groupList: any = [];
  groupMemberList: any = [];
  dueDays: string;
  frequency: string;
  selectedGroupName: string;
  selectedGroupId:string;
  @Output() ngModelChangeVal = new EventEmitter<any>();
  FrequencydataList: Array<any> = [];

  config = {
    height: '4rem',
    minHeight: '5rem',
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

  constructor(public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService, public datepipe: DatePipe,
    private todoTaskService: TodoTaskService,
    private alertService: AlertService, public dialogRef: MatDialogRef<AddtaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.groupList = data.groupList;

    // this.groupMemberList = data.groupMembers;

    this.FrequencydataList = [
      { id: 1, name: "Daily" },
      { id: 2, name: "Weekly" },
      { id: 3, name: "Monthly" }
    ]
  }

  ngOnInit() {
    let groupId = localStorage.getItem('groupId');
    let groupName = localStorage.getItem('groupName');
    this.selectedGroupId = groupId || null
    this.selectedGroupName = groupName;
    this.AddTaskForm = this.fb.group({
      groupName: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
      userId: [null],
      taskDescription: ['', [Validators.required]],
      taskDueDate: [''],
      recurringEndDate: [],
      showMasterTaskCheckbox: [],
      dueDay: ['', [Validators.required]],
      frequency: [null, [Validators.required]],
    });
  }

  getGroupId($event) {
    if ($event == null || $event == undefined || $event == "") {
      return;
    } else {
      this.todoTaskService.getGroupMembers($event).subscribe((res) => {
        this.groupMemberList = res.groupMembers;
      }, (error) => {
      });
    }
    this.ngModelChangeVal.emit($event); // this will pass the $event object to the parent component.
  }

  get a() { return this.AddTaskForm.controls; }
  onSubmitAddTask() {
    this.AddTaskForm;
    if (this.showMasterTaskCheckbox === true) {
      if (this.AddTaskForm.value.frequency == undefined || this.AddTaskForm.value.frequency == null || this.AddTaskForm.value.frequency == "") {
        this.frequency = "Frequency is required";
      }
      if (this.AddTaskForm.value.dueDay == undefined || this.AddTaskForm.value.dueDay == null || this.AddTaskForm.value.dueDay == "") {
        this.dueDays = "Due Days in numbers is required";
      }
      if (this.AddTaskForm.value.dueDay > 365) {
        this.dueDays = "Due days should not greater than 365 days";
        return
      }
    }
    let getGroupId = localStorage.getItem('groupId');
    this.submitted = true;
    let taskDueDate = this.datepipe.transform(this.AddTaskForm.value.taskDueDate, 'yyyy-MM-dd');
    let createData = {
      groupId: this.AddTaskForm.value.groupId ? this.AddTaskForm.value.groupId : getGroupId,
      taskDescription: this.AddTaskForm.value.taskDescription,
      taskAssignTo: this.AddTaskForm.value.userId,
      taskDueDate: taskDueDate,
      taskStatus: 'Open'
    }
    let recurringEndDate = this.datepipe.transform(this.AddTaskForm.value.taskDueDate, 'yyyy-MM-dd');
    let createMasterData = {
      groupId: this.AddTaskForm.value.groupId ? this.AddTaskForm.value.groupId : getGroupId,
      taskDescription: this.AddTaskForm.value.taskDescription,
      taskAssignTo: this.AddTaskForm.value.userId,
      taskStatus: '',
      frequency: this.AddTaskForm.value.frequency,
      recurringEndDate: recurringEndDate,
      dueDay: this.AddTaskForm.value.dueDay
    }
    if (this.AddTaskForm.value.taskDescription == "" || this.AddTaskForm.value.taskDescription == null) {
      return false;
    }
    if (getGroupId == null) {
      this.userErrorMsg = "Please select group";
      setTimeout(() => {
        this.userErrorMsg = "";
      }, 3000);
      return false;
    } else {
      this.userErrorMsg = '';
    }
    if (this.showMasterTaskCheckbox === true) {

      if (this.AddTaskForm.value.dueDay == "" || this.AddTaskForm.value.dueDay == null) {
        return false;
      }

      if (this.AddTaskForm.value.frequency == "" || this.AddTaskForm.value.frequency == null) {
        return false;
      }
      this.todoTaskService.addMasterTask(createMasterData).subscribe((res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            this.AddTaskForm.reset();
            this.submitted = false;
            this.frequency = "";
            this.dueDays = "";
            this.showMasterTaskCheckbox = false;
            let taskClosedCall = {
              groupId: this.AddTaskForm.value.groupId ? this.AddTaskForm.value.groupId : getGroupId,
              groupName: this.AddTaskForm.value.groupName || this.selectedGroupName,
            }
            this.dialogRef.close(taskClosedCall);
          }
        }
      }, (error) => {
        this.alertService.error(error);
        this.loadingBtn = false;
        this.toastr.error('Error', error);
      });
    } else {
      this.todoTaskService.addGroupTask(createData).subscribe((res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            this.AddTaskForm.reset();
            this.submitted = false;
            this.frequency = "";
            this.dueDays = "";
            let taskClosedCall = {
              groupId: this.AddTaskForm.value.groupId ? this.AddTaskForm.value.groupId : getGroupId,
              groupName: this.AddTaskForm.value.groupName || this.selectedGroupName,
            }
            this.dialogRef.close(taskClosedCall);
          }
        }
      }, (error) => {
        this.alertService.error(error);
        this.toastr.error('Error', error);
      });
    }
  }
  openTextCopyPanel() {

  }
  toggleVisibilityMastrForm(e) {
    this.showMasterTaskCheckbox = e.checked;
    if (e.checked == true) {
      setTimeout(() => {
        this.AddTaskForm.get('frequency')?.setErrors(null);
        this.AddTaskForm.get('dueDay')?.setErrors(null);
      }, 10);
    }

  }

  addFormClear() {

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
  onfrequencyEvent(event) {
    if (event == undefined) {
      this.frequency = "Frequency is required";
    } else {
      if (event.name != "") {
        this.frequency = "";
      } else {
        this.frequency = "Frequency is required";
      }
    }
  }
  close(): void {
    this.dialogRef.close();
  }

}
