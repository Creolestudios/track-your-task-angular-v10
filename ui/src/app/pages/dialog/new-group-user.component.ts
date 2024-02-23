import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MustMatch, isArrayOfEmails, isEmail } from '../../_helpers/must-match.validator';
import { isArrayTagEmails } from '../../_helpers/tag-email.validator';
@Component({
  selector: 'app-new-group-user',
  templateUrl: './new-group-user.component.html',
  styleUrls: ['./new-group-user.component.css']
})
export class NewGroupUserComponent implements OnInit {
  title: string;
  message: string;
  groupId: string;
  DeleteMsg: string;
  groupName: string;
  addGroupNewMembersForm: FormGroup;
  newMembers: any = [];
  AddGroupForm: FormGroup;
  User: any;
  isGroupAdmin: any;
  submitted: boolean = false;
  loadingBtn = false;
  constructor(private formBuilder: FormBuilder, private todoTaskService: TodoTaskService, private toastr: ToastrService,
    private alertService: AlertService, public dialogRef: MatDialogRef<NewGroupUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.groupId = data.groupId;
    this.DeleteMsg = data.DeleteMsg,
      this.groupName = data.groupName
  }

  ngOnInit() {
    if (this.groupId === null || this.groupId === undefined) {
      false
    } else {
      this.getNewMembersList(this.groupId);
    }
    this.User = JSON.parse(sessionStorage.getItem("userData"));
    this.isGroupAdmin = localStorage.getItem('isGroupAdmin');
    this.addGroupNewMembersForm = this.formBuilder.group({
      userEmail: new FormControl('', []),
    });

  }

  getNewMembersList(groupId) {
    this.todoTaskService.getNewMembersList(groupId).subscribe((res) => {
      this.newMembers = res.newMembers;
    }, (error) => {
      this.alertService.error(error);
      // this.toastr.error('Error', error);
    });
  }

  get f() { return this.addGroupNewMembersForm.controls; }
  addGroupMembers(addGroupNewMembersForm) {
    this.loadingBtn = true;
    if (this.groupId === null || this.groupId === undefined) {
      this.loadingBtn = false;
      return this.toastr.error('Error', "Please select group");
    } else {
      if (this.addGroupNewMembersForm.controls.userEmail.value.length === 0 || this.addGroupNewMembersForm.controls.userEmail.value === null || this.addGroupNewMembersForm.controls.userEmail.value === "") {
        this.loadingBtn = false;
        return this.toastr.error('Error', "Please select users or add email address");
      } else if (this.addGroupNewMembersForm.controls.userEmail.value.length != 0) {
        let arrEmail = [];
        for (let j = 0; j < this.addGroupNewMembersForm.controls.userEmail.value.length; j++) {

          let userEmailCommaList = this.addGroupNewMembersForm.controls.userEmail.value.join(",");
          const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!emailPattern.test(this.addGroupNewMembersForm.controls.userEmail.value[j].trim())) {
            this.loadingBtn = false;
            return this.toastr.error('Error', "Please enter valid email");
          } else {
            let usersEmailList = this.addGroupNewMembersForm.controls.userEmail.value.join(",");
            arrEmail = usersEmailList.split(',');
          }
        }
        let addNewGroupMembersData = {
          usersEmail: arrEmail,
        }
        this.todoTaskService.addGroupMember(this.groupId, addNewGroupMembersData).subscribe((res) => {
          if (res.status === false) {
          } else {
            if (res.status === 'success') {
              this.toastr.success('Success', res.message);
              this.loadingBtn = false;
              this.dialogRef.close({ groupId: this.groupId }); // does not close the dialog
            }
          }
        }, (error) => {
          this.alertService.error(error);
          this.toastr.error('Error', error);
          this.loadingBtn = false;
        });
      } else {
        this.loadingBtn = false;
      }

    }
  }
  public onSelectAll() {
    const selected = this.newMembers.map(item => item.userEmail);
    this.addGroupNewMembersForm.get('userEmail').patchValue(selected);
  }

  public onClearAll() {
    this.addGroupNewMembersForm.get('userEmail').patchValue([]);
  }
  addGroupCancel(): void {
    this.dialogRef.close({ event: 'close', groupId: this.groupId });
  }
}
