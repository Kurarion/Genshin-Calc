import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noStrong'
})
export class NoStrongPipe implements PipeTransform {

  transform(val: string | null | undefined): string {
    if (val !== undefined && val !== null) {
      return val.replace(/\*\*/g, "");
    } else {
      return "";
    }
  }

}
