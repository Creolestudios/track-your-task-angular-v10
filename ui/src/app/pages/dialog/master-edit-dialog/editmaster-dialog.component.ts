import { Component, OnInit, Inject, Output, EventEmitter, OnDestroy } from '@angular/core';
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
  selector: 'app-editmaster-dialog',
  templateUrl: './editmaster-dialog.component.html',
  styleUrls: ['./editmaster-dialog.component.css']
})
export class EditMasterDialogComponent implements OnInit {
  quickSpinner = false;
  isAnimate: true;
  html = "";
  EditMasterTaskForm: FormGroup;
  loadingBtn
  FrequencydataList = [];
  masterTaskRow: any;
  groupMemberData = [];
  selectedGroupId: string;
  selected: any;
  userErrorMsg: string;
  taskUpdateSubmitted = false;
  SelectedGroupName: string;
  dueDays: string;
  editDueDays: string;
  checkAssignUserValue: any;
  selectedFrequency: any;

  config = {
    height: 60,
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
    private alertService: AlertService, public dialogRef: MatDialogRef<EditMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.masterTaskRow = data.masterTaskRow;
    this.groupMemberData = data.groupMembers;

    this.FrequencydataList = [
      { id: 1, name: "Daily" },
      { id: 2, name: "Weekly" },
      { id: 3, name: "Monthly" }
    ]
  }

  ngOnInit() {
    const groupName = localStorage.getItem('groupName');
    this.EditMasterTaskForm = this.fb.group({
      taskAssignTo: [null],
      dueDay: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      recurringEndDate: ['']
    });
    this.selectedFrequency = this.masterTaskRow.frequency;
    this.SelectedGroupName = groupName;
    this.getMasterTaskDetails(this.masterTaskRow)
  }

  public currenTask;
  getMasterTaskDetails(masterTaskRow) {
    if (masterTaskRow.masterTaskId != null || masterTaskRow.masterTaskId != undefined) {
      this.groupMemberData;
      for (let i = 0; i < this.groupMemberData.length; i++) {
        if (masterTaskRow.taskAssignTo === this.groupMemberData[i].userId) {
          this.checkAssignUserValue = masterTaskRow.taskAssignTo; break;
        } else {
          this.checkAssignUserValue = null;
        }
      }
      if (this.checkAssignUserValue == null) {
        let EditData = {
          dueDay: masterTaskRow.dueDay,
          taskDescription: masterTaskRow.taskDescription,
          taskAssignTo: this.checkAssignUserValue,
          frequency: masterTaskRow.frequency,
          recurringEndDate: masterTaskRow.recurringEndDate
        }
        this.EditMasterTaskForm.patchValue(EditData);
      } else {
        let EditData = {
          dueDay: masterTaskRow.dueDay,
          taskDescription: masterTaskRow.taskDescription,
          taskAssignTo: this.checkAssignUserValue,
          frequency: masterTaskRow.frequency,
          recurringEndDate: masterTaskRow.recurringEndDate
        }
        this.EditMasterTaskForm.patchValue(EditData);
      }
    }
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

    this.todoTaskService.updateMasterTask(this.masterTaskRow.masterTaskId, createData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          let masterGroupId = localStorage.getItem('masterGroupId');
          this.taskUpdateSubmitted = false;
          let taskClosedCall = {
            masterGroupId: this.masterTaskRow.groupId ? this.masterTaskRow.groupId : masterGroupId,
            masterGroupName: this.masterTaskRow.groupName,
          }
          this.dialogRef.close(taskClosedCall);
          this.dueDays = "";
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
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

  close(): void {
    this.dialogRef.close();
  }

}
