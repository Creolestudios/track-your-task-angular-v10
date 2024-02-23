import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, ObservableInput } from 'rxjs';
import { from as observableFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from "../_models/user";
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({ providedIn: 'root' })
@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  getAllUsers(): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}/users`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  inviteUsers(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/users/invite`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  changePassword(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/users/change`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUserProfile(updateData): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token= localStorage.getItem('Token');
    
     this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.put<any>(`${environment.apiUrl}` + `/users/profile/update/`, updateData, { headers: this.headers })
    .pipe(
      catchError(this.handleError)
    );
  }

  contactUS(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/front/contactUS`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}
