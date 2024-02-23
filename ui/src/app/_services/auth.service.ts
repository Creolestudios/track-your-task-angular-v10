import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { LoaderService } from '../_services/loader.service'

@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  token: any = localStorage.getItem('Token');
  authorizationValue: any;
  headers: any;

  constructor(private http: HttpClient,private loader:LoaderService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(userEmail: string, password: string) {
    this.loader.spin$.next(true);
    const transferObject = {

      userEmail: userEmail,
      password: password,
    }

    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${environment.apiUrl}/login`, transferObject, { headers: header })
      .pipe(map((user) => {
        localStorage.setItem('currentUser', JSON.stringify(user.loginDetails));
        this.currentUserSubject.next(user);
        return user;
        // return user;
      }), catchError(this.handleError));
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.error.message || error.error.message);
  }

  forgotPassword(userEmail: string) {
    this.loader.spin$.next(true);
    const transferObject = {

      userEmail: userEmail,
    }
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/users/reset`, transferObject, { headers: this.headers })
      .pipe(map((res) => {
        return res;
      }), catchError(this.handleError)
      );
  }

  userRegister(data: string) {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/users`, data, { headers: this.headers })
      .pipe(map((res) => {
        return res;
      }), catchError(this.handleError)
      );
  }

  signupUser(data: string) {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/users/signup`, data, { headers: this.headers })
      .pipe(map((res) => {
        return res;
      }), catchError(this.handleError)
      );
  }

  restPassword(data): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token= localStorage.getItem('Token');
     this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/users/confirmreset`, data, { headers: this.headers })
      .pipe(
        // tap(_ => this.log(data)),
        catchError(this.handleError)
      );
  }

  getResponse(linkedInCredentials) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token= localStorage.getItem('Token');
     this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`https://www.linkedin.com/uas/oauth2/accessToken?grant_type=${linkedInCredentials.grant_type}&redirect_uri=${linkedInCredentials.redirect_uri}&client_id=${linkedInCredentials.client_id}&client_secret=${linkedInCredentials.client_secret}&code=${linkedInCredentials.code}`, { headers: this.headers })
      .pipe(
        // tap(_ => this.log(data)),
        catchError(this.handleError)
      );
    // return this.http.get(`);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
