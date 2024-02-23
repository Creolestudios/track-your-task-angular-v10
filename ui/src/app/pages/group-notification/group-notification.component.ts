import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../_services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialog2Component } from '../../pages/dialog/confirm-dialog2.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { SeoService } from '../../_services/seo.service';
import { DataService } from '../../_services/data.service';

interface IItem {
  title: string;
  src: string;
  blur: string;
}

const ITEMS_COUNT = 10000;
@Component({
  selector: 'app-group-notification',
  templateUrl: './group-notification.component.html',
  styleUrls: ['./group-notification.component.css']
})
export class GroupNotificationComponent implements OnInit {
  receivedGroupInvitationsList: any[];
  loading;
  loadingBtn = false;
  // searchUsers = false;
  buttonName = 'Show';
  userdata: any = []; pageSize: any;
  config: any;
  totalItems = 0;
  size = 0;
  pageIndex = 0;
  collection = { data: [] };
  users: any = [];
  dataSource = [];
  term = "";
  p: any
  message = false;
  myInvitationVal: number;
  data: any;
  valueFromChild: string;

  myInvitationCount
  constructor(private router: Router,private dataService: DataService,public notificationService: NotificationService, private toastr: ToastrService, public dialog: MatDialog, private seo: SeoService) {
    this.seo.setTags({
      title: 'Invitations', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'User Invitations', // Description
      image: '', // Image
      keywords: 'Task, Task management , Invitations, group Invitations' // Keywords
    });

  }

  ngOnInit(): void {
    this.getInvitationNotifications();
  }

  readOutputValueEmitted(val) {
    this.valueFromChild = val;
  }

  getInvitationNotifications() {
    this.notificationService.getAllInvitationList().subscribe((res) => {
      this.receivedGroupInvitationsList = res.receivedGroupInvitations;
      length = this.receivedGroupInvitationsList.filter(function(item){
        return item.isAccepted == false && item.isRejected == false;
      }).length;
      this.myInvitationCount = length
      if (this.receivedGroupInvitationsList.length == 0) {
        this.message = true;
      } else {
        this.message = false;
      }
    }, (error) => {
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  acceptInvitation(invitationId, isAccepted) {
    let data = {
      isAccepted: true
    }
    this.notificationService.acceptInvitation(invitationId, data).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.getInvitationNotifications();
          this.dataService.setInviteInfo({
            invitationTotalCount: (this.myInvitationCount - 1)
          });
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });

  }

  rejectInvitation(invitationId, isRejected) {
    let data = {
      isRejected: true
    }
    this.notificationService.rejectInvitation(invitationId, data).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.getInvitationNotifications();
          this.dataService.setInviteInfo({
            invitationTotalCount: (this.myInvitationCount - 1)
          });
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  // searchBar() {
  //   this.searchUsers = !this.searchUsers
  //   if (this.searchUsers) {
  //     this.buttonName = 'Hide';
  //   }
  //   else {
  //     this.buttonName = 'Show'
  //   }
  // }

  paginate(event: any) {
    this.pageIndex = event;
    this.dataSource = this.collection.data.slice(event * this.size - this.size, event * this.size);
  }

}
