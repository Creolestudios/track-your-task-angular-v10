import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-dialog2',
  templateUrl: './confirm-dialog2.component.html',
  styleUrls: ['./confirm-dialog2.component.css']
})
export class ConfirmDialog2Component implements OnInit {
  title: string;
  message: string;
  TaskId: string;
  DeleteMsg: string;
  groupName: string;
  AddGroupForm: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder, private todoTaskService: TodoTaskService, private toastr: ToastrService,
    private alertService: AlertService, public dialogRef: MatDialogRef<ConfirmDialog2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.TaskId = data.TaskId;
    this.DeleteMsg = data.DeleteMsg,
      this.groupName = data.groupName
  }

  ngOnInit() {
  }
  close(TaskId) {
    this.todoTaskService.deleteTask(TaskId).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.dialogRef.close({ groupName: this.groupName, TaskId: this.TaskId }); // does not close the dialog
        }
      }
    }, (error) => {
      this.alertService.error(error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  close1(): void {
    this.dialogRef.close({ event: 'close', groupName: this.groupName, TaskId: this.TaskId });
  }
}
