import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../../_services/alert.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { LoaderService } from '../../../_services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addmastertask-dialog',
  templateUrl: './addmastertask-dialog.component.html',
  styleUrls: ['./addmastertask-dialog.component.css']
})
export class AddMasterTaskDialogComponent implements OnInit {
  isAnimate: true;
  submitted;
  html = "";
  AddMasterTaskForm: FormGroup;
  loadingBtn
  dueDays: string;
  FrequencydataList = [];
  groupList = [];
  groupMemberList = [];
  selectedGroupId: string;
  userErrorMsg: string;
  selectedGroupName: string;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService, public datepipe: DatePipe,
    private todoTaskService: TodoTaskService,
    private alertService: AlertService, public dialogRef: MatDialogRef<AddMasterTaskDialogComponent>,
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
    let masterGroupId = localStorage.getItem('masterGroupId');
    this.selectedGroupName = localStorage.getItem('masterGroupName');
    this.selectedGroupId = masterGroupId;
    this.AddMasterTaskForm = this.fb.group({
      taskAssignTo: [null],
      dueDay: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      frequency: [null, [Validators.required]],
      recurringEndDate: [''],
      groupId: [null, [Validators.required]],
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
    // this.ngModelChangeVal.emit($event); // this will pass the $event object to the parent component.
  }

  get g() { return this.AddMasterTaskForm.controls; }
  saveMasterTask() {
    let masterGroupId = localStorage.getItem('masterGroupId');

    this.submitted = true;
    if (this.AddMasterTaskForm.value.dueDay == "" || this.AddMasterTaskForm.value.dueDay == null) {
      this.dueDays = "Due days in numbers is required";
      return;
    }
    if ((this.AddMasterTaskForm.value.dueDay) > 365) {
      return
    }
    if (this.AddMasterTaskForm.invalid) {
      return;
    }

    let recurringEndDate = this.datepipe.transform(this.AddMasterTaskForm.value.recurringEndDate, 'yyyy-MM-dd');
    let createData = {
      groupId: this.AddMasterTaskForm.value.groupId,
      taskDescription: this.AddMasterTaskForm.value.taskDescription,
      taskAssignTo: this.AddMasterTaskForm.value.taskAssignTo,
      frequency: this.AddMasterTaskForm.value.frequency,
      recurringEndDate: recurringEndDate,
      dueDay: this.AddMasterTaskForm.value.dueDay,
      taskStatus: ""
    }
    if (this.AddMasterTaskForm.value.taskDescription == "" || this.AddMasterTaskForm.value.taskDescription == null
      || this.AddMasterTaskForm.value.frequency == null || this.AddMasterTaskForm.value.frequency == "" || this.AddMasterTaskForm.value.dueDay == "" || this.AddMasterTaskForm.value.dueDay == null) {
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
          this.loadingBtn = false;
          this.submitted = false;
          this.dueDays = "";
          let taskClosedCall = {
            masterGroupId: this.AddMasterTaskForm.value.groupId,
            masterGroupName: this.AddMasterTaskForm.value.groupName || this.selectedGroupName,
          }
          this.dialogRef.close(taskClosedCall);
          this.AddMasterTaskForm.reset();
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
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
  addFormClear() {
    this.AddMasterTaskForm.reset();
    this.submitted = false;
    this.dueDays = "";
    this.close()
  }
  close(): void {
    this.dialogRef.close();
  }
}
