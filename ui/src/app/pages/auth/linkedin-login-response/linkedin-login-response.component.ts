import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/_services/auth.service';

@Component({
  selector: 'app-linkedin-login-response',
  templateUrl: './linkedin-login-response.component.html',
  styleUrls: ['./linkedin-login-response.component.css']
})
export class LinkedinLoginResponseComponent implements OnInit {
  linkedInToken = "";
  linkedInCredentials
  resposnseData = null;
  authBody

  constructor(private route: ActivatedRoute, private authService: AuthService,) {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
   this.authBody = this.linkedInCredentials = {
      grant_type: "authorization_code",  // value of this field should always be: 'authorization_code'
      code: this.linkedInToken,
      redirect_uri: "http://localhost:4200/login",  // The same redirect_url used in step 2.1 (in login.component.ts)
      client_id: '770ykxr2mys9tk', // Follow step 1.2
      client_secret: 'mFHLi7cSU5AEvMEx'   // Follow step 1.2
    }
    this.resposnseData = window.location.href = `https://www.linkedin.com/uas/oauth2/accessToken?grant_type=${this.linkedInCredentials.grant_type}&redirect_uri=${this.linkedInCredentials.redirect_uri}&client_id=${this.linkedInCredentials.client_id}&client_secret=${this.linkedInCredentials.client_secret}&code=${this.linkedInCredentials.code}`;
    console.log(this.resposnseData)
  }

  ngOnInit(): void {
    // this.linkedInToken = this.route.snapshot.queryParams["code"];
    // this.getResponse()
  }

  getResponse() {

    // this.resposnseData = window.location.href = `https://www.linkedin.com/uas/oauth2/accessToken?grant_type=${this.linkedInCredentials.grant_type}&redirect_uri=${this.linkedInCredentials.redirect_uri}&client_id=${this.linkedInCredentials.client_id}&client_secret=${this.linkedInCredentials.client_secret}&code=${this.linkedInCredentials.code}`;
    console.log(this.resposnseData)
  }
}
