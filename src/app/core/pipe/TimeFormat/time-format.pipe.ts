import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    const timeParts = value.split(':');
    return `${timeParts[0]}:${timeParts[1]}`;
  }
}
