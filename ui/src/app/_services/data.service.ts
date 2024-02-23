import { Injectable } from '@angular/core';
import { BehaviorSubject,Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {
  taskListData: [];
  constructor() { }

  private newNoteCount = new BehaviorSubject<any>({
    notificaionTotalCount: 0
  });
  private newIniteCount = new BehaviorSubject<any>({
    invitationTotalCount: 0
  });

  private masterTaskListData = new BehaviorSubject<any>({
    //   data:this.masterTaskListData
  });
  private groupUserData = new BehaviorSubject<any>({
  });
  private sessionData = new BehaviorSubject<any>({
  });
  private taskData = new Subject<any>();

  private taskEditCom = new BehaviorSubject<any>({
    data: true,
    addCompoent: false
  });

  setNoteInfo(noteCount: any) {
    this.newNoteCount.next(noteCount);
  }

  getNewNoteInfo() {
    return this.newNoteCount.asObservable();
  }

  setInviteInfo(InviteCount: any) {
    this.newIniteCount.next(InviteCount);
  }

  getNewInviteInfo() {
    return this.newIniteCount.asObservable();
  }

  //  group wise task list data 
  setMastTaskListData(taskListData: any) {
    this.masterTaskListData.next(taskListData);
  }
  getMastTaskListData() {
    return this.masterTaskListData.asObservable();
  }

  setTaskCompoent(editCompoent: any) {
    this.taskEditCom.next(editCompoent);
  }
  getTaskComponet() {
    return this.taskEditCom.asObservable();
  }
  public editPanel = new BehaviorSubject<boolean>(false);
  setHideEditPanel(changeToggle: boolean) {
    this.editPanel.next(changeToggle);
  }

  getsetHideEditPanel() {
    return this.editPanel.asObservable();
  }


  // getGroupUserData
  setGroupUserData(groupUserData: any) {
    this.groupUserData.next(groupUserData);
  }
  getGroupUserData() {
    return this.groupUserData.asObservable();
  }

  // Session data 
  setSessionData(sessiondata: any) {
    this.sessionData.next(sessiondata);
  }
  getSessionData() {
    return this.sessionData.asObservable();
  }

  // -- task id
  setTaskId(taskId: any) {
    this.taskData.next(taskId);
  }
  getTaskId() {
    return this.taskData.asObservable();
  }
}