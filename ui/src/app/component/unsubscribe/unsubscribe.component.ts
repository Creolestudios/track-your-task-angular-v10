// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';

// RxJS
import { Subject } from 'rxjs';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    // console.log('\n UNSUBSCRIBE \n');
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
