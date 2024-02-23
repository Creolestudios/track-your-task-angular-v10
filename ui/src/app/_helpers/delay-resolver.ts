import { Injectable } from '@angular/core'
import { Resolve } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DelayResolver implements Resolve<any> {
  resolve() {
    return of('').pipe(delay(200));
  }
}