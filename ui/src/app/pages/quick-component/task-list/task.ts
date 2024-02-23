export class Task {
  constructor(public isClosed: boolean,public isTaskOverDue:boolean, public isMarkMyTask:any,public taskDueDate:string, public taskStatus:string,public userDetails:any, public taskAssignTo: string,public groupId: string, public taskId: string, public taskDescription: string) {
  }
}

// "groupId": "cf2b5ccc-cfaa-11ec-b780-4fdfa1fccfc4",
// "taskId": "06e71836-d04b-11ec-a1df-dbdb6bbb65eb",
// "taskDescription": "<p>dcsd</p>",
// "taskAssignTo": null,
// "taskDueDate": "2022-05-12",
// "isTaskOverDue": false,
// "isClose": false,
// "taskStatus": "Open",
// "userDetails": {
