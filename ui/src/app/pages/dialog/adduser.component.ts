
import { Component, OnInit, Optional, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl,AbstractControl } from '@angular/forms';
// import { EmployeeService } from '../services/employee.service';
// import { ToastrService } from 'ngx-toastr';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { UserService } from '../../_services/user.service';
import { AlertService } from '../../_services/alert.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MustMatch, isArrayOfEmails, isEmail } from '../../_helpers/must-match.validator';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'adduser',
  templateUrl: 'adduser.component.html',
  styleUrls: ['adduser.component.css'],
})


export class AdduserComponent {
  adduser: FormGroup;
  submitted: boolean = false;
  loading: boolean;
  inviteUsersForm: FormGroup
  errorMsg:string = '';
  groupId: string;
  loadingBtn = false;
  constructor(
    private alertService: AlertService,
    public router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<AdduserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.groupId = data.pageValue;
    }

  ngOnInit() {
    // this.inviteUsersForm = this.formBuilder.group({
    //   // usersEmail: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    //   usersEmail: ['',this.emailValidator],
    // });
    this.inviteUsersForm = this.formBuilder.group({
      usersEmail: new FormControl('', [isArrayOfEmails]),
    });
  }


  get f() { return this.inviteUsersForm.controls; }
  userInvite(inviteUsersForm) {
    this.submitted = true;
    if (inviteUsersForm.value.usersEmail == "") {
     return;
    }
    this.loadingBtn = true;
    var emailArr = inviteUsersForm.value.usersEmail.split(',');
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(inviteUsersForm.value.usersEmail.trim())) {
      this.loadingBtn = false;
      return 
    }
    let inviteUsers = {
      usersEmail: emailArr,
      role: 'User',
      groupId: this.groupId
    }
    this.userService.inviteUsers(inviteUsers).subscribe((res) => {
      if (res.status === 'failed') {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.loadingBtn = false;
          this.dialogRef.close(false);
         
        }
      }
    }, (error) => {
      this.alertService.error(error);
      this.loadingBtn = false;
      this.toastr.error('Error',error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  close(): void {
    this.dialogRef.close({ event: 'close' });
  }

}