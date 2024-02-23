import { Injectable } from '@angular/core';

//cdk
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

//rxjs
import { Observable, Subject } from 'rxjs'
import { mapTo, scan, map, mergeMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
    // isLoading = new Subject<boolean>();
    // show() {
    //     this.isLoading.next(true);
    // }
    // hide() {
    //     this.isLoading.next(false);
    // }
    private spinnerTopRef = this.cdkSpinnerCreate();

    spin$ :Subject<boolean> = new Subject<boolean>()
    
    constructor(
      private overlay: Overlay,
  ) {

    this.spin$
      .asObservable()
      .pipe(
        map(val => val ? 1 : -1 ),
        scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
      )
      .subscribe(
        (res) => {
          if(res === 1){ this.showSpinner() }
          else if( res == 0 ){ 
            this.spinnerTopRef.hasAttached() ? this.stopSpinner(): null;
          }else if( res === 2 ){
            this.spinnerTopRef.detach() ;
          }
        }
      )
  }

  private cdkSpinnerCreate() {
      return this.overlay.create({
          hasBackdrop: true,
          backdropClass: 'dark-backdrop',
          positionStrategy: this.overlay.position()
              .global()
              .centerHorizontally()
              .centerVertically()
      })
  }

  private showSpinner(){
    this.spinnerTopRef.attach(new ComponentPortal(MatSpinner))
  }

  private stopSpinner(){
    this.spinnerTopRef.detach() ;
  }
}