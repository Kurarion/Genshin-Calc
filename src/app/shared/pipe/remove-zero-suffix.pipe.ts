import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeZeroSuffix'
})
export class RemoveZeroSuffixPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\.0$/,'');
  }

}
