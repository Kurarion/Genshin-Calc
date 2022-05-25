import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rate'
})
export class RatePipe implements PipeTransform {

  transform(value: number, rates: number[], index: number): any {
    if (value && rates && index) {
      return value*rates[index];
    }
    return value;
  }

}
