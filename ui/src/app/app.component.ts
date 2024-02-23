import { Component, ElementRef, Inject } from '@angular/core';
import { AlertService } from './_services/alert.service';
import { ConnectionService } from 'ng-connection-service';
import { LoaderService } from './_services/loader.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-tracker-web';
  status = 'ONLINE';
  isConnected = true;
  netWorkStatusOff = false;
  netWorkStatusOn = false;
  User: any;
  loading = false;
  currentUser: User;
  constructor(private authService: AuthService,private router: Router,private connectionService: ConnectionService, private alertService: AlertService,
    private elementRef: ElementRef, @Inject(DOCUMENT) private doc) {
      this.authService.currentUser.subscribe(x => this.currentUser = x);
        router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.loading = true;
      }else if(event instanceof NavigationEnd) {
        this.loading = false;
      }
    })

    this.User = JSON.parse(sessionStorage.getItem("userData"));
    if (this.User == null || this.User == undefined) {
      localStorage.clear()
    }

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.netWorkStatusOn = true;
        setTimeout(() => {
          this.netWorkStatusOn = false;
        }, 10000);
        // alert('ONLINE')
        // open('Online')
      }
      else {
        this.netWorkStatusOff = true;
        this.status = "OFFLINE";
        setTimeout(() => {
          this.netWorkStatusOff = false;
        }, 10000);
        // open('OFFLINE')
      }
    })
  }
  ngOnInit(): void {
    var s1 = document.createElement("script");
    var s2 = document.createElement("script");
    var s3 = document.createElement("script");
    s1.type = "text/javascript";
    s2.src = "../assets/asset/js/plugins/jquery.2.1.0.min.js";
    s3.src = "../assets/asset/js/plugins/splitting.js";
    s1.src = "../assets/asset/js/main.js";
    this.elementRef.nativeElement.appendChild(s1);
    this.elementRef.nativeElement.appendChild(s2);
    this.elementRef.nativeElement.appendChild(s3);
  }
}
