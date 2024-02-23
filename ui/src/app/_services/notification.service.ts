import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, ObservableInput } from 'rxjs';
import { from as observableFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from "../_models/user";
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public stringSubject = new Subject<string>();
  header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  token: any = localStorage.getItem('Token');
  authorizationValue: any;
  headers: any;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.error.message || error.error.message);
  }
  constructor(private http: HttpClient) {
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
  passValue(data) {
    //passing the data as the next observable
    this.stringSubject.next(data);
  }

  getAllNotificationList(): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}/notification`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getInvitationsCount(): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}/groups/invitation/count`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getNotificationCount(): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}/notification/new/count`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  getAllInvitationList(): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}/groups/received/invitations`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  markAsRead(invitationId, data) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.request('put', `${environment.apiUrl}` + `/notification/${invitationId}`, { body: data, headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  allReadNotification(data) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.put<any>(`${environment.apiUrl}` + `/notification/status/all/`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  acceptInvitation(invitationId, data) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.request('put', `${environment.apiUrl}` + `/groups/accept/invitation/${invitationId}`, { body: data, headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  rejectInvitation(invitationId, data) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.request('put', `${environment.apiUrl}` + `/groups/reject/invitation/${invitationId}`, { body: data, headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}