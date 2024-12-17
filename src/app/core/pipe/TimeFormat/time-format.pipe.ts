import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    const timeParts = value.split(':');
    const hour = Number(timeParts[0]);

    const format =
      hour > 12
        ? `${hour - 12}:${timeParts[1]} PM`
        : `${hour}:${timeParts[1]} AM`;
    return format;
    // return `${timeParts[0]}:${timeParts[1]}` + format;
  }
}
