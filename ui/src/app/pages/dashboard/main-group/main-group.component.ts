import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { TodoTaskService } from '..//../../_services/todo-task.service';

@Component({
  selector: 'app-main-group',
  templateUrl: './main-group.component.html',
  styleUrls: ['./main-group.component.css']
})
export class MainGroupComponent implements OnInit {
  groupAllData = [];
  allGroupDataArr = [];
  OpenTaskList = [];
  InProgressTaskList = [];
  DoneTaskList = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptionsGroups: any = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Stacked column chart'
    },
    credits: {
      enabled: false
    },

    xAxis: {
      categories: ['No data'],
      scrollbar: {
        enabled: true
      },
      min: 0,
      max: 0,
      labels: {
        style: {
          width: '50px',
          whiteSpace: 'normal'//set to normal
        },
        useHTML: true
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total no. of tasks'
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: ( // theme
            Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color
          ) || 'gray'
        }
      }
    },
    legend: {
      align: 'right',
      x: -30,
      verticalAlign: 'top',
      y: 25,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || 'white',
      borderColor: '#CCC',
      borderWidth: 1,
      shadow: false
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: [{
      name: 'Open',
      color: '#6c757d',
      data: [0]
    }, {
      name: 'In Progress',
      color: '#ffbf00',
      data: [0]
    }, {
      name: 'Done',
      color: '#008000',
      data: [0]
    }]
  };

  constructor(public todoTaskService: TodoTaskService) { }

  ngOnInit(): void {
    this.getGroupDataList();
  }

  getGroupDataList() {
    this.todoTaskService.getGroupDataList().subscribe((res) => {
      this.groupAllData = res.groupAllData;
      if (res.groupAllData.length == 0) {
        this.chartOptionsGroups = {
          chart: {
            type: 'column',
            width: '200',
            height: 200,
          },
          title: {
            text: 'Groups Stats'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: ['No data'],
            // min: 0,
            // max: 20,
            scrollbar: {
              enabled: true
            },
            // labels: {
            //   style: {
            //     width: '100%',
            //     // whiteSpace:'normal'//set to normal
            //   },
            //   useHTML: true
            // }
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total no. of tasks'
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: ( // theme
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
                ) || 'gray'
              }
            }
          },
          legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
          tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
          },
          series: [{
            name: 'Open',
            color: '#6c757d',
            data: [0]
          }, {
            name: 'In Progress',
            color: '#ffbf00',
            data: [0]
          }, {
            name: 'Done',
            color: '#008000',
            data: [0]
          }]
        };
      } else {
        this.allGroupDataArr = [];
        let groupListArr = []
        for (let i = 0; i < res.groupAllData.length; i++) {
          groupListArr.push(res.groupAllData[i].groupName)
          this.allGroupDataArr = groupListArr
          let openCount = res.groupAllData[i].dataList.filter(x => x.taskStatus === 'Open').length
          this.OpenTaskList.push(openCount);
          let inprogressCount = res.groupAllData[i].dataList.filter(x => x.taskStatus === 'In Progress').length
          this.InProgressTaskList.push(inprogressCount)
          let doneCount = res.groupAllData[i].dataList.filter(x => x.taskStatus === 'Done').length
          this.DoneTaskList.push(doneCount)
        }
        this.allGroupDataArr = groupListArr;

        this.chartOptionsGroups = {
          chart: {
            type: 'column',
            width: '50'
          },
          title: {
            text: 'Groups Stats'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: this.allGroupDataArr,
            min:0,
            max: 6,
            scrollbar: {
              enabled: true
            },
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total no. of tasks'
            },
            stackLabels: {
              enabled: true,
              style: {
                fontWeight: 'bold',
                color: ( // theme
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
                ) || 'gray'
              }
            }
          },
          legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor:
              Highcharts.defaultOptions.legend.backgroundColor || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
          tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
          },
          plotOptions: {
            column: {
              stacking: 'normal',
              dataLabels: {
                enabled: true
              }
            }
          },
          series: [{
            name: 'Open',
            color: '#6c757d',
            data: this.OpenTaskList
          }, {
            name: 'In Progress',
            color: '#ffbf00',
            data: this.InProgressTaskList
          }, {
            name: 'Done',
            color: '#008000',
            data: this.DoneTaskList
          }]
        };
      }

    }, (error) => {

    });
  }
}
