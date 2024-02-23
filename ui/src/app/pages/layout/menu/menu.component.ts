import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { AlertService } from './../../../_services/alert.service';
import { ConnectionService } from 'ng-connection-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../../component/snackbar.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { NotificationService } from '../../../_services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../_services/data.service';

export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  isOpen = false;
  status = 'ONLINE';
  isConnected = true;
  netWorkStatusOff = false;
  netWorkStatusOn = false;
  duration: 5000;
  message = 'You lost your network!!!';
  message1 = 'Back Online !!!';
  isLoggedIn = false;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  userName: string;
  myInvitationVal: any;
  notificationList = [];
  ErrorMessage = false;
  textErrorMsg: string
  myInvitationCount: number;
  NotificationsCount: number;
  notificationMessage = false;
  notiFicationhidden = false;
  inviteHidden = false;
  checkNotificationCount = 0;
  checkInvitationCount = 0;
  newInviteCount
  newNotificationCount;
  headerLink = false;
  textShow: number;
  textShowAllMArk = false;
  constructor(private dataService: DataService, private toastr: ToastrService, public notificationService: NotificationService, public snackBar: MatSnackBar, private connectionService: ConnectionService, private alertService: AlertService, public router: Router, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private tokenStorageService: TokenStorageService) {
    this.userName = localStorage.getItem('userName');
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.netWorkStatusOn = true;
        this.Online()
        setTimeout(() => {
          this.netWorkStatusOn = false;
        }, 10000);
      }
      else {
        this.netWorkStatusOff = true;
        this.status = "OFFLINE";
        this.Offline()
        setTimeout(() => {
          this.netWorkStatusOff = false;
        }, 10000);
      }
    })

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  cancelClick(ev: MouseEvent) {
    ev.stopPropagation();
  }
  openMyMenu() {
    this.trigger.toggleMenu();
  }
  Offline() {
    this.openSnackBar(this.message, 'pizza-party');
  }
  Online() {
    this.openSnackBar(this.message1, 'pizza-party');
  }
  openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: panelClass,
      duration: 10000
    });
  }
  menu: NavItem[] = [
    {
      displayName: 'Dashboard',
      iconName: 'desktop_windows',
      route: '/dashboard',
    },
    {
      displayName: 'Entradas GADE',
      iconName: 'ballot',
      route: 'entradasGADE',
    },
    {
      displayName: 'Expedientes',
      iconName: 'description',
      children: [
        {
          displayName: 'Mis Expedientes',
          iconName: 'how_to_reg',
          route: '/misexpedientes'
        },
        {
          displayName: 'Todos',
          iconName: 'waves',
          route: '/todos'
        }
      ]
    },
    {
      displayName: 'Perfiles',
      iconName: 'group',
      children: [
        {
          displayName: 'Búsqueda Perfil',
          iconName: 'search',
          route: '/busquedaperfiles'
        }
      ]
    }
  ];
  ngOnInit(): void {

    (function ($) {
      "use strict";

      $(function () {
        var header = $(".start-style");
        $(window).scroll(function () {
          var scroll = $(window).scrollTop();

          if (scroll >= 10) {
            header.removeClass('start-style').addClass("scroll-on");
          } else {
            header.removeClass("scroll-on").addClass('start-style');
          }
        });
      });

      //Animation

      $(document).ready(function () {
        $('body.hero-anime').removeClass('hero-anime');
      });

      //Menu On Hover

      $('body').on('mouseenter mouseleave', '.nav-item', function (e) {
        if ($(window).width() > 600) {
          var _d = $(e.target).closest('.nav-item'); _d.addClass('show');
          setTimeout(function () {
            _d[_d.is(':hover') ? 'addClass' : 'removeClass']('show');
          }, 1);
        }
      });

      //Switch light/dark

      $("#switch").on('click', function () {
        if ($("body").hasClass("dark")) {
          $("body").removeClass("dark");
          $("#switch").removeClass("switched");
        }
        else {
          $("body").addClass("dark");
          $("#switch").addClass("switched");
        }
      });

    })(jQuery);

    this.getNotifications();
    this.getInvitationsCount();
    this.getNotificationCount();

    this.dataService.getNewNoteInfo().subscribe(noteCount => {
      this.newNotificationCount = noteCount.notificaionTotalCount;
      if (noteCount.notificaionTotalCount == 0) {
        // this.noTeBadgeVisibility(this.newNotificationCount)
      }
      this.getNotifications();
    })

    this.dataService.getNewInviteInfo().subscribe(InviteCount => {
      this.newInviteCount = InviteCount.invitationTotalCount;
      if (InviteCount.invitationTotalCount == 0) {
        // this.inviteBadgeVisibility(this.newInviteCount)
      }
    })

  }

  redirectModule(moduleType) {
    switch (moduleType) {
      case 'task':
        return this.router.navigate(['/todo-task']);
      case 'group':
        return this.router.navigate(['/todo-task']);;
      case 'group_invite':
        return this.router.navigate(['/group-notification']);
    }
  }

  cancelRemoveClick(ev: MouseEvent) {
    ev.stopPropagation();
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
          this.getNotificationCount();
          this.redirectModule(moduleType);
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });

  }
  getInvitationsCount() {
    this.notificationService.getInvitationsCount().subscribe((res) => {
      this.myInvitationCount = res.newInvitationsCount;
      this.newInviteCount = +this.myInvitationCount; //easy way by using + operator

      // this.inviteBadgeVisibility(this.newInviteCount);
      if (this.myInvitationCount == 0) {
        this.ErrorMessage = true;
      } else {
        this.myInvitationCount;
        this.ErrorMessage = false;
      }

    }, (error) => {
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe((res) => {
      this.NotificationsCount = res.newNotificationsCount;
      this.newNotificationCount = +this.NotificationsCount; //easy way by using + operator
      // this.noTeBadgeVisibility( this.newNotificationCount);
      if (this.NotificationsCount == 0) {
        this.notificationMessage = true;
      } else {
        this.NotificationsCount;
        this.notificationMessage = false;
      }

    }, (error) => {
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
          this.getNotificationCount();
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }
  getNotifications() {
    this.notificationService.getAllNotificationList().subscribe((res) => {
      this.notificationList = res.notifications;
      length = this.notificationList.filter(function(item){
        return item.isRead == false;
      }).length;
      if(length > 0){
        this.textShowAllMArk = true;
      }else{
        this.textShowAllMArk = false;
      }

      if (this.notificationList.length == 0) {
        this.headerLink = true;
        this.ErrorMessage = true;
        this.textShow = 0;
      } else {
        this.ErrorMessage = false;
        this.headerLink = false;
        this.textShow = 1;
      }
    }, (error) => {
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  fillerContent = Array.from({ length: 50 }, () =>
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
       labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
       laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
       voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
       cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`);

  private _mobileQueryListener: () => void;



  ngOnDestroy(): void {
    // if (this.notificationService.stringSubject.isStopped)   
    // this.notificationService.stringSubject.unsubscribe();
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  // shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  logout() {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }
}
