import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../_services/seo.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    private seo: SeoService
  ) { 
    this.seo.setTags({
      title: 'Page Not Found', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Page Not Found', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });
  }

  ngOnInit(): void {
  }

}
