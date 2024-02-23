import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;
  groupId: string;
  DeleteMsg: string;
  groupName: string;
  AddGroupForm: FormGroup;
  constructor(private router: Router, private formBuilder: FormBuilder, private todoTaskService: TodoTaskService, private toastr: ToastrService,
    private alertService: AlertService, public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.groupId = data.groupId;
    this.DeleteMsg = data.DeleteMsg,
      this.groupName = data.groupName
  }

  ngOnInit() {
  }
  close(groupId) {
    this.todoTaskService.deleteGroup(groupId).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.dialogRef.close({ groupName: this.groupName, groupId: this.groupId }); // does not close the dialog
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
    this.dialogRef.close({ event: 'close', groupName: this.groupName, groupId: this.groupId });
  }
}
