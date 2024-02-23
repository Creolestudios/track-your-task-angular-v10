import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../_services/notification.service';
import { DataService } from '../../_services/data.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  receivedGroupInvitationsList: any[];
  loading;
  loadingBtn = false;
  searchUsers = false;
  buttonName = 'Show';
  ErrorMessage = false;
  notificationList = [];
  term = "";
  notificaionTotalCount: any;
  textShowAllMArk = false;
  constructor(private router: Router, private dataService: DataService, public notificationService: NotificationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getNotifications()
  }

  getNotifications() {
    this.notificationService.getAllNotificationList().subscribe((res) => {
      this.notificationList = res.notifications;
      length = this.notificationList.filter(function (item) {
        return item.isRead == false;
      }).length;
      this.notificaionTotalCount = length
      if (length > 0) {
        this.textShowAllMArk = true;
      } else {
        this.textShowAllMArk = false;
      }

      if (this.notificationList.length == 0) {
        this.ErrorMessage = true;
      } else {
        this.ErrorMessage = false;
      }
      this.dataService.setNoteInfo({
        notificaionTotalCount: (this.notificaionTotalCount)
      });
    }, (error) => {
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  markRead(notificationId, moduleType) {

    let data = {
      isRead: true
    }
    this.notificationService.markAsRead(notificationId, data).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.getNotifications();
          this.dataService.setNoteInfo({
            notificaionTotalCount: (this.notificaionTotalCount - 1)
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

  markAsAllRead() {
    let data = {
      isRead: true
    }
    this.notificationService.allReadNotification(data).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.getNotifications();
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  searchBar() {
    this.searchUsers = !this.searchUsers
    if (this.searchUsers) {
      this.buttonName = 'Hide';
    }
    else {
      this.buttonName = 'Show'
    }
  }
}
