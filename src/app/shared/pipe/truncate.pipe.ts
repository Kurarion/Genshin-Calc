import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string | number | undefined): number {
    if(value != undefined && typeof value == 'number'){
      return Math.floor(value);
    }
    return 0;
  }

}
