import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDecimalPipe',
})
export class CustomDecimalPipePipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}
  transform(value: unknown, ...args: unknown[]): unknown {
    let formattedValue = value;
    if (formattedValue && typeof value == 'number') {
      return this.decimalPipe.transform(value, '1.2-2');
    }
    return formattedValue;
  }
}
