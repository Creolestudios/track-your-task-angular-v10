import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class TodoTaskService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  token: any = localStorage.getItem('Token');
  authorizationValue: any;
  headers: any;

  constructor(private http: HttpClient, private loader: LoaderService) {
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
  addGroup(data): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/groups`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  acceptInvitation(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/groups/email/accept/invitation`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  makeUserToAdmin(data):Observable<any>{
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);

    return this.http.post<any>(`${environment.apiUrl}`+`/task/updateUserAdmin/`,data,{ headers: this.headers })
    .pipe(
      catchError(this.handleError)
    )
  }

  rejectInvitation(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/groups/email/reject/invitation`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  addGroupTask(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/task/create`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  saveDragAndDropData(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/task/create/neworder/dropposition`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  addMasterTask(data): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/mastertask/create`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  addGroupMember(groupId, data): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.request('post', `${environment.apiUrl}` + `/groups/members/${groupId} `, { body: data, headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  getGroupList(): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getTaskDataAssinedByGroups(): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/task/groups/assined/tasklist/bygroups/list`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getGroupDataList(): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups/dashboard/groupdata`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMembersList(): Observable<any> {

    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups/members/list`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getSystemSettingList(): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/systemsettings`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEmailSetting(data, groupId) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.request('put', `${environment.apiUrl}` + `/groups/mailpreference/${groupId}`, { body: data, headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getGroupDetails(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getMasterTaskDetailsById(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/mastertask/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  // updateEmailSetting(updateData): Observable<any> {
  //   this.loader.spin$.next(true);
  //   this.header = new HttpHeaders().set('Content-Type', 'application/json');
  //   this.token= localStorage.getItem('Token');

  //    this.authorizationValue = 'Bearer ' + this.token;
  //   this.headers = this.header.append('Authorization', this.authorizationValue);
  //   return this.http.put<any>(`${environment.apiUrl}` + `/systemsettings`+ updateData, { headers: this.headers })
  //   .pipe(
  //     catchError(this.handleError)
  //   );
  // }
  getNewMembersList(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups/members/new/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getGroupMembers(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups/members/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteGroup(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.delete<any>(`${environment.apiUrl}` + `/groups/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getGroupTaskList(id): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/task/list/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getGroupByTaskList(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/task/list/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getGroupMasterTaskList(id): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/mastertask/list/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getFilterTaskList(data): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/task/filter/list`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getTaskDetails(id): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/task/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getGroupOwnerList(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups/members/newowner/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  getTask(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/task/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getMasterTask(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/mastertask/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateGroupTask(taskId, updateData): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.put<any>(`${environment.apiUrl}` + `/task/update/` + taskId, updateData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  updateMasterTask(masterTaskId, updateData): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.put<any>(`${environment.apiUrl}` + `/mastertask/update/` + masterTaskId, updateData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  addFavGroup(favData): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.put<any>(`${environment.apiUrl}` + `/groups/user/favorite/`, favData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  leaveGroup(memberId, data) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.request('delete', `${environment.apiUrl}` + `/groups/members/leave/${memberId} `, { body: data, headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  closedTask(taskId): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.delete<any>(`${environment.apiUrl}` + `/task/group/status/change/${taskId}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteTask(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.delete<any>(`${environment.apiUrl}` + `/task/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteMasterTask(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.delete<any>(`${environment.apiUrl}` + `/mastertask/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteGroupMenber(memberId, data) {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');
    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.request('delete', `${environment.apiUrl}` + `/groups/members/${memberId} `, { body: data, headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateTaskStatus(taskId, updateData): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.put<any>(`${environment.apiUrl}` + `/task/changestatus/` + taskId, updateData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateGroup(groupId, updateData): Observable<any> {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.put<any>(`${environment.apiUrl}` + `/groups/` + groupId, updateData, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getGroup(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/groups/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  groupTaskReminder(id): Observable<any> {
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.get<any>(`${environment.apiUrl}` + `/task/group/members/reminder/${id}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  addTextToTextTask(data) {
    this.loader.spin$.next(true);
    this.header = new HttpHeaders().set('Content-Type', 'application/json');
    this.token = localStorage.getItem('Token');

    this.authorizationValue = 'Bearer ' + this.token;
    this.headers = this.header.append('Authorization', this.authorizationValue);
    return this.http.post<any>(`${environment.apiUrl}` + `/task/create/texttotask`, data, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.error.message || error.error.message);
  }
}
