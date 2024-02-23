import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loader'
})
export class LoaderPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
