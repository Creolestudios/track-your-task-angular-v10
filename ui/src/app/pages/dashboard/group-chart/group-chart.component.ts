import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TodoTaskService } from '..//../../_services/todo-task.service';
import * as Highcharts from 'highcharts/highstock';
import { Options } from "highcharts";
import { TodoDialogComponent } from '../../../pages/dialog/todo-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-group-chart',
  templateUrl: './group-chart.component.html',
  styleUrls: ['./group-chart.component.css']
})
export class GroupChartComponent implements OnInit {
  @Output() public groupCount = new EventEmitter();
  selectedStatus: string;
  groupList = [];
  selectedGroupId: any;
  groupTaskList = [];
  OpenTaskList = [];
  DoneTaskList = [];
  InProgressTaskList = [];
  groupMemberData = [];
  resourceByTask = [];
  resourceByTaskCount = [];
  allTaskList = []
  updateFlag = false;
  seletedUser: string;
  selectedGroupName: string;
  // HighchartsBarChart: typeof Highcharts = Highcharts;
  Highcharts: typeof Highcharts = Highcharts;

  chartOptionsResource: any = {
    chart: {
      height: 254,

    },
    credits: {
      enabled: false
    },
    title: {
      text: ''
    },
    yAxis: {
      categories: ['No Data'],
    },
    xAxis: {
      categories: ['']
    },
    labels: {
      items: [{
        html: '',
        style: {
          left: '50px',
          top: '18px',
          color: ['#ffbf00']
        }
      }]
    },
    series: [{
      type: 'column',
      name: 'Open',
      data: [0],
      color: '#6c757d'
    }, {
      type: 'column',
      name: 'In Progress',
      data: [0],
      color: '#ffbf00'
    }, {
      type: 'column',
      name: 'Done',
      data: [0],
      color: '#008000'
    },
    // {
    //     type: 'spline',
    //     name: 'Average',
    //     data: [3],
    //     marker: {
    //         lineWidth: 2,
    //         lineColor: Highcharts.getOptions().colors[3],
    //         fillColor: 'white'
    //     }
    // },
    {
      type: 'pie',
      name: '',
      data: [{
        name: 'Open',
        y: 0,
        color: '#6c757d'
      }, {
        name: 'In Progress',
        y: 0,
        color: '#ffbf00'
      }, {
        name: 'Done',
        y: 0,
        color: '#008000'
      }],
      center: [20, 60],
      size: 80,
      showInLegend: false,
      dataLabels: {
        enabled: false
      }
    }]
  };
  public chartOptionsPiechartDueTask: any = {
    chart: {
      height: 300,
      borderWidth: 0,
      plotBorderWidth: null,
      type: 'pie'
    },
    title: {
      text: 'Group status'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'Task',
      colorByPoint: true,
      data: [
        {
          name: 'Open',
          y: 5,
          sliced: false,
          selected: true,
          color: '#ff1515'
        },
        // {
        //   name: 'Due Task',
        //   y: 0,
        //   color: '#ff1515'
        // }
      ]
    }]
  }
  public chartOptionsPiechart: any = {
    chart: {
      height: 300,
      // borderColor: '#EBBA95',
      borderWidth: 0,
      // plotBackgroundColor: null,
      plotBorderWidth: null,
      // plotBackgroundColor: '#FFFFFF',
      // plotShadow: true,
      type: 'pie'
    },
    title: {
      text: 'Group status'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'Task',
      colorByPoint: true,
      data: [
        {
          name: 'Open',
          y: 0,
          sliced: false,
          selected: true,
          color: '#6c757d'
        },
        {
          name: 'In Progress',
          y: 0,
          color: '#ffbf00'
        }, {
          name: 'Done',
          y: 0,
          color: '#008000'
        },
        {
          name: 'Over due date tasks',
          y: 0,
          color: '#FF5D5D'
        }]
    }]
  }
  userOpenTaskList: any[];
  userInProgressTaskList: any[];
  userDoneTaskList: any[];
  unassignedTasks: any[];
  dueDateList: any[];
  taskDetailsData = [];
  errorMesg = false;
  myTaskList = []
  taskSearch
  highestTask: number;
  dataList = []
  constructor(public todoTaskService: TodoTaskService,
    private toastr: ToastrService,
    public dialog: MatDialog
    ) {
      this.dataList = [
        { id: 1, name: "Open" },
        { id: 2, name: "In Progress" },
        { id: 3, name: "Done" }
      ]
    }

  ngOnInit(): void {

    this.getGroupList();


  }

  getGroupList() {
    this.todoTaskService.getGroupList().subscribe((res) => {
      this.groupList = res.groups;
      this.selectedGroupId = this.groupList[0]?.groupId || null;
      let getGroupId = localStorage.getItem('groupId');
      let groupName = localStorage.getItem('groupName');
      this.selectedGroupName = this.groupList[0]?.groupName ? this.groupList[0]?.groupName : groupName;
      console.log(this.selectedGroupName)
      if(this.selectedGroupName == undefined){
        return;
      }
      this.getGroupdeatils(this.selectedGroupId || getGroupId)
      this.groupCount.emit(this.groupList.length);
      this.getMyTasksByGroupId(this.selectedGroupId || getGroupId);
    }, (error) => {

    });
  }


  getSelectedGroupId(event: string) {
    if (event == null || event == undefined) {
      return
    }
    const result = this.groupList.find(({ groupId }) => groupId === event);
    this.selectedGroupName = result.groupName;
    // localStorage.setItem('groupName', this.selectedGroupName);
    this.getGroupdeatils(event);
    this.getMyTasksByGroupId(event);
  }

  getGroupdeatils(groupId) {
    if (groupId == null || groupId == undefined) {
      return
    }
    this.todoTaskService.getGroupTaskList(groupId).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.taskList.length == 0) {
          this.seletedUser = null
          this.groupTaskList = [];
          this.chartOptionsResource = {
            chart: {
              height: 254,
            },
            labels: {
              items: [{
                html: '',
                style: {
                  left: '50px',
                  top: '18px',
                  color: ['#ffbf00']
                }
              }]
            },
            series: [{
              type: 'column',
              name: 'Open',
              data: [0],
              color: '#6c757d'
            }, {
              type: 'column',
              name: 'In Progress',
              data: [0],
              color: '#ffbf00'
            }, {
              type: 'column',
              name: 'Done',
              data: [0],
              color: '#008000'
            },
            {
              type: 'pie',
              name: '',
              data: [{
                name: 'Open',
                y: 0,
                color: '#6c757d'
              }, {
                name: 'In Progress',
                y: 0,
                color: '#ffbf00'
              }, {
                name: 'Done',
                y: 0,
                color: '#008000'
              }],
              center: [20, 60],
              size: 80,
              showInLegend: false,
              dataLabels: {
                enabled: false
              }
            }]
          }
          this.chartOptionsPiechart = {
            series: [{
              name: 'Task',
              colorByPoint: true,
              data: [
                {
                  name: 'Open',
                  y: 0,
                  sliced: false,
                  selected: true,
                  color: '#6c757d'
                },
                {
                  name: 'In Progress',
                  y: 0,
                  color: '#ffbf00'
                }, {
                  name: 'Done',
                  y: 0,
                  color: '#008000'
                },
                {
                  name: 'Over due date tasks',
                  y: 0,
                  color: '#008000'
                }]
            }]
          }
          return
        } else {
          this.groupTaskList = res.taskList;
          this.seletedUser = this.groupTaskList[0]?.userDetails?.userId ? this.groupTaskList[0]?.userDetails?.userId : null
          let grpuMemberData = this.getGroupMembers(groupId)
          this.getMyTasks(groupId, this.groupTaskList[0]?.userDetails?.userId);
          //group members array
          let grupMembersArr = new Array()
          for (let s = 0; s < res.taskList.length; s++) {
            for (let t = 0; t < grpuMemberData.length; t++) {
              if (res.taskList[s].userDetails.userEmail == grpuMemberData[t].userEmail) {
                grupMembersArr.push({
                  groupId: res.taskList[s].groupId,
                  userEmail: res.taskList[s].userDetails.userEmail,
                  taskStatus: res.taskList[s].taskStatus
                })
              }
            }
          }
          this.resourceByTask = grupMembersArr
          this.OpenTaskList = [];
          let arrOpenTask = new Array()
          for (let i = 0; i < res.taskList.length; i++) {
            if (res.taskList[i].taskStatus == 'Open') {
              arrOpenTask.push({
                groupId: res.taskList[i].groupId
              })
            }
          }
          this.OpenTaskList = arrOpenTask;
          this.InProgressTaskList = [];
          let arrInProgressTask = new Array()
          for (let k = 0; k < res.taskList.length; k++) {
            if (res.taskList[k].taskStatus == 'In Progress') {
              arrInProgressTask.push({
                taskId: res.taskList[k].taskId,
              })
            }
          }
          this.InProgressTaskList = arrInProgressTask;

          this.DoneTaskList = [];
          let arrDoneTask = new Array()
          for (let j = 0; j < res.taskList.length; j++) {
            if (res.taskList[j].taskStatus == 'Done') {
              arrDoneTask.push({
                taskId: res.taskList[j].taskId,
              })
            }
          }
          this.DoneTaskList = arrDoneTask;

          this.dueDateList = [];
          let arrDueDate = new Array()
          for (let m = 0; m < res.taskList.length; m++) {
            if (res.taskList[m].isTaskOverDue == true){
              arrDueDate.push({
                  taskId: res.taskList[m].taskId,
                })
              }
          }
          this.dueDateList = arrDueDate;
          this.chartOptionsPiechart = {
            chart: {
              height: 300,
              // borderColor: '#EBBA95',
              borderWidth: 0,
              // plotBackgroundColor: null,
              plotBorderWidth: null,
              // plotBackgroundColor: '#FFFFFF',
              // plotShadow: true,
              type: 'pie'
            },
            title: {
              text: this.selectedGroupName
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            accessibility: {
              point: {
                valueSuffix: '%'
              }
            },
            credits: {
              enabled: false
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
              }
            },
            series: [{
              name: 'Task',
              colorByPoint: true,
              data: [
                {
                  name: 'Open',
                  y: this.OpenTaskList.length || 0,
                  sliced: false,
                  selected: true,
                  color: '#6c757d'
                },
                {
                  name: 'In Progress',
                  y: this.InProgressTaskList.length || 0,
                  color: '#ffbf00'
                }, {
                  name: 'Done',
                  y: this.DoneTaskList.length || 0,
                  color: '#008000'
                },
                {
                  name: 'Over due date tasks',
                  y:  this.dueDateList.length || 0,
                  color: '#FF5D5D'
                }]
            }]
          }
          this.updateFlag = true;
        }
      }

    }, (error) => {
    });
    return this.groupTaskList;
  }

  getMyTasks(getGroupId, userId) {
    let taskFilterBody = {
      groupId: getGroupId,
      userId: userId,
      taskAssignTo: 'mycharttasks',
      taskDueDate: '',
      taskStatus: ''
    }
    this.todoTaskService.getFilterTaskList(taskFilterBody).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.taskList.length == 0) {
          this.groupTaskList = [];
          this.chartOptionsResource = {
            chart: {
              height: 254,
            },
            labels: {
              items: [{
                html: '',
                style: {
                  left: '50px',
                  top: '18px',
                  color: ['#ffbf00']
                }
              }]
            },
            series: [{
              type: 'column',
              name: 'Open',
              data: [0],
              color: '#6c757d'
            }, {
              type: 'column',
              name: 'In Progress',
              data: [0],
              color: '#ffbf00'
            }, {
              type: 'column',
              name: 'Done',
              data: [0],
              color: '#008000'
            },
            {
              type: 'pie',
              name: '',
              data: [{
                name: 'Open',
                y: 0,
                color: '#6c757d'
              }, {
                name: 'In Progress',
                y: 0,
                color: '#ffbf00'
              }, {
                name: 'Done',
                y: 0,
                color: '#008000'
              }],
              center: [20, 60],
              size: 80,
              showInLegend: false,
              dataLabels: {
                enabled: false
              }
            }]
          }
          return
        } else {
          this.groupTaskList = res.taskList;
          let userName = this.groupTaskList[0]?.userDetails?.userName;
          this.userOpenTaskList = [];
          let arrOpenTask = new Array()
          for (let i = 0; i < res.taskList.length; i++) {
            if (res.taskList[i].taskStatus == 'Open') {
              arrOpenTask.push({
                groupId: res.taskList[i].groupId
              })
            }
          }
          this.userOpenTaskList = arrOpenTask;

          this.userInProgressTaskList = [];
          let arrInProgressTask = new Array()
          for (let k = 0; k < res.taskList.length; k++) {
            if (res.taskList[k].taskStatus == 'In Progress') {
              arrInProgressTask.push({
                taskId: res.taskList[k].taskId,
              })
            }
          }
          this.userInProgressTaskList = arrInProgressTask;

          this.DoneTaskList = [];
          let arrDoneTask = new Array()
          for (let j = 0; j < res.taskList.length; j++) {
            if (res.taskList[j].taskStatus == 'Done') {
              arrDoneTask.push({
                taskId: res.taskList[j].taskId,
              })
            }
          }
          this.userDoneTaskList = arrDoneTask;

          this.dueDateList = [];
          let arrDueDate = new Array()
          for (let m = 0; m < res.taskList.length; m++) {
            if (res.taskList[m].isTaskOverDue == true){
              arrDueDate.push({
                  taskId: res.taskList[m].taskId,
                })
              }
          }
          this.dueDateList = arrDueDate;



          this.chartOptionsResource = {
            chart: {
              height: 254,
            },
            credits: {
              enabled: false
            },
            title: {
              text: ''
            },
            yAxis: {
              categories: ['No. Of tasks'],
            },
            xAxis: {
              categories: [userName]
            },
            labels: {
              items: [{
                html: '',
                style: {
                  left: '50px',
                  top: '18px',
                  color: ['#ffbf00']
                }
              }]
            },
            series: [{
              type: 'column',
              name: 'Open',
              data: [this.userOpenTaskList.length || 0],
              color: '#6c757d'
            }, {
              type: 'column',
              name: 'In Progress',
              data: [this.userInProgressTaskList.length || 0],
              color: '#ffbf00'
            }, {
              type: 'column',
              name: 'Done',
              data: [this.userDoneTaskList.length || 0],
              color: '#008000'
            }, {
              type: 'column',
              name: 'Over due date tasks',
              data: [this.dueDateList.length || 0],
              color: '#FF5D5D'
            },
            // {
            //     type: 'spline',
            //     name: 'Average',
            //     data: [3],
            //     marker: {
            //         lineWidth: 2,
            //         lineColor: Highcharts.getOptions().colors[3],
            //         fillColor: 'white'
            //     }
            // },
            {
              type: 'pie',
              name: '',
              data: [{
                name: 'Open',
                y: this.userOpenTaskList.length,
                color: '#6c757d'
              }, {
                name: 'In Progress',
                y: this.userInProgressTaskList.length,
                color: '#ffbf00'
              }, {
                name: 'Done',
                y: this.userDoneTaskList.length,
                color: '#008000'
              }],
              center: [20, 60],
              size: 80,
              showInLegend: false,
              dataLabels: {
                enabled: false
              }
            }]
          }
        }
      }
    }, (error) => {
    });
    return this.groupTaskList
  }

  getSelectedUserId(userId) {
    if (userId == null || userId == undefined) {
      return
    }
    this.selectedGroupId;
    this.getMyTasks(this.selectedGroupId, userId,);
  }

  getGroupMembers(groupId) {
    if (groupId == null || groupId == undefined || groupId == "") {
      return;
    } else {
      this.todoTaskService.getGroupMembers(groupId).subscribe((res) => {
        this.groupMemberData = res.groupMembers;
        this.groupTaskList
        let arrResorceCount = []
        for (let m = 0; m < res.groupMembers.length; m++) {
          let openCount = this.groupTaskList.filter(x => x.taskStatus === 'Done' && x.taskAssignTo === res.groupMembers[m].userId).length;
          arrResorceCount.push({
            userId: res.groupMembers[m].userId,
            userName: res.groupMembers[m].userName,
            doneTaskCount:openCount
          })
          this.resourceByTaskCount = arrResorceCount.sort(function(a, b) {
            return b.doneTaskCount - a.doneTaskCount;
          });
            const doneTaskCount = this.resourceByTaskCount.map((a) => a.doneTaskCount)
            this.highestTask = Math.max(...doneTaskCount);
        }
      }, (error) => {

      });
    }
    return this.groupMemberData
  }

  getMyTasksByGroupId(groupId) {
    if (groupId == null || groupId == undefined) {
      return
    }
    let taskFilterBody = {
      groupId: groupId,
      taskAssignTo: 'mytasks',
      taskDueDate: '',
      taskStatus: ''
    }
    this.todoTaskService.getFilterTaskList(taskFilterBody).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.taskList.length > 0) {
          this.myTaskList = res.taskList;
          this.errorMesg = false;
        } else {
          this.myTaskList = [];
          this.errorMesg = true;
        }
      }
    }, (error) => {
    });
  }

  taskStatusValue(value) {
    this.selectedStatus = value.taskStatus;
  }
  getTaskStatusValue(event, rowData) {
    let data = {
      taskStatus: event.name
    }
    this.todoTaskService.updateTaskStatus(rowData.taskId, data).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.getMyTasksByGroupId(rowData.groupId)
        }
      }
    }, (error) => {

    });
  }
  cancelRemoveClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  add3Dots(string, limit) {
    var dots = "....";
    if (string.length > limit) {
      string = string.substring(0, limit) + dots;
    }
    return string;
  }
  getTaskDetailsById(taskId) {
    if (taskId != null || taskId != undefined || taskId != "")
      this.todoTaskService.getTaskDetails(taskId).subscribe((res) => {
        if (res) {
          this.taskDetailsData = res;
          const dialogRef = this.dialog.open(TodoDialogComponent, {
            width: '740px',
            height: 'auto',
            backdropClass: 'custom-dialog-backdrop-class',
            panelClass: 'custom-dialog-panel-class',
            data: { pageValue: this.taskDetailsData }
          });
          dialogRef.afterClosed().subscribe(result => {
          });
        }

      }, (error) => {
      });
  }

}
