import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import {HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';

import {LoaderService} from '../_services/loader.service';
import { finalize } from "rxjs/operators";
import {OverlayService} from '../_services/overlay.service';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor  {

  constructor(private loader: LoaderService,private overlayService: OverlayService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // this.loader.show()
   
    // this.overlayService.spin$.next()
    return next.handle(req).pipe(
      finalize(() =>  this.loader.spin$.next(false))
    );

  }
}
 