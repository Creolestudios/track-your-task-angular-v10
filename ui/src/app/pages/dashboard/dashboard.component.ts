import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../_services/auth.service';
import { SeoService } from '../../_services/seo.service';
import * as Highcharts from 'highcharts/highstock';
// import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  getGroupCount: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private seo: SeoService
  ) {
    this.seo.setTags({
      title: 'Dashboard', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Dashboard', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });
  }

  ngOnInit() {
  }
  getGroupCnt(data) {
    this.getGroupCount = data;
  }
}
