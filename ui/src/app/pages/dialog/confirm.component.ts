import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html', 
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
    title: string;
    message: string;
    TaskId: string;
    DeleteMsg: string;
    groupName: string;
    AddGroupForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<ConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
        // Update view with given values
        this.title = data.title;
        this.message = data.message;
      }
    
      ngOnInit() {
      }
    
      onConfirm(): void {
        // Close the dialog, return true
        this.dialogRef.close(true);
      }
    
      onDismiss(): void {
        // Close the dialog, return false
        this.dialogRef.close(false);
      }
    }
    
    /**
     * Class to represent confirm dialog model.
     *
     * It has been kept here to keep it as part of shared component.
     */
    export class ConfirmDialogModel {
    
      constructor(public title: string, public message: string) {
      }
    }
    