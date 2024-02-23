import { Component, OnInit, Inject, Output, EventEmitter,OnDestroy } from '@angular/core';
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
  selector: 'app-edittask-dialog',
  templateUrl: './edittask-dialog.component.html',
  styleUrls: ['./edittask-dialog.component.css']
})
export class EditTaskDialogComponent implements OnInit  {
  isAnimate: true;
  html = "";
  EditTaskForm: FormGroup;
  loadingBtn
  FrequencydataList = [];
  taskDetails: any;
  groupMemberData = [];
  selectedGroupId: string;
  selected: any;
  userErrorMsg: string;
  taskUpdateSubmitted = false;
  SelectedGroupName:string;

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
  currenTask: any;
  constructor(public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService, public datepipe: DatePipe,
    private todoTaskService: TodoTaskService,
    private alertService: AlertService, public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.taskDetails = data.taskDetails;
    // this.groupMemberData = data.groupMembers;

    this.SelectedGroupName = this.taskDetails.groupName;
    this.selected = this.taskDetails.groupName;
    this.FrequencydataList = [
      { id: 1, name: "Daily" },
      { id: 2, name: "Weekly" },
      { id: 3, name: "Monthly" }
    ]
  }

  ngOnInit() {
    const groupId = localStorage.getItem('groupId');
    const groupName = localStorage.getItem('groupName');
    this.EditTaskForm = this.fb.group({
      userId: [],
      taskDescription: ['', [Validators.required]],
      taskDueDate: [''],
    });
    this.getGroupMembers(groupId)
    this.getTaskDetails(this.taskDetails)
    this.SelectedGroupName = groupName;
  }

  getGroupMembers(groupId) {
    if (groupId == null || groupId == undefined || groupId == "") {
      return;
    } else {
      this.todoTaskService.getGroupMembers(groupId).subscribe((res) => {
        this.groupMemberData = res.groupMembers;
      }, (error) => {

      });
    }
  }
  getTaskDetails(val) {
    this.currenTask = val.taskId ? val.taskId : localStorage.getItem('taskId');
    if (val.userDetails.userId == undefined) {
      let EditData = {
        taskDescription: val.taskDescription,
        userId: null,
        taskDueDate: val.taskDueDate,
      }
      this.selected = null;
      this.EditTaskForm.setValue(EditData);
    } else {
      let EditData = {
        taskDescription: val.taskDescription,
        userId: val.userDetails.userId,
        taskDueDate: val.taskDueDate,
      }
      this.selected = val.userDetails.userId;
      this.EditTaskForm.setValue(EditData);
    }
  }

  get g() { return this.EditTaskForm.controls; }
  onSubmitUpdateTask(EditTaskForm) {
    this.taskUpdateSubmitted = true;
    let updateTaskDueDate = this.datepipe.transform(this.EditTaskForm.value.taskDueDate, 'yyyy-MM-dd');
    let updateData = {
      groupId: this.taskDetails.groupId,
      taskDescription: EditTaskForm.value.taskDescription,
      taskAssignTo: EditTaskForm.value.userId,
      taskDueDate: updateTaskDueDate,
      taskStatus: this.taskDetails.taskStatus,
    }
    if (EditTaskForm.value.taskDescription == "" || EditTaskForm.value.taskDescription == null) {
      return false;
    }
    this.todoTaskService.updateGroupTask(this.taskDetails.taskId, updateData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.taskUpdateSubmitted = false;
          this.EditTaskForm.reset();
          let getGroupId = localStorage.getItem('groupId');
          let taskClosedCall = {
            groupId: this.taskDetails.groupId ? this.taskDetails.groupId : getGroupId,
            groupName: this.taskDetails.groupName,
          }
          this.dialogRef.close(taskClosedCall);
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
  }

  editTaskCancel() {
    this.dialogRef.close();
    this.taskUpdateSubmitted = false;
  }

  close(): void {
    this.dialogRef.close();
  }

}
