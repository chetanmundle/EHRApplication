import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomTimeValidator {
  static validateEndTimeWithinOneHour(
    startTimeControlName: string
  ): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control.parent;
      if (!formGroup) return null;

      const startTimeControl = formGroup.get(startTimeControlName);
      if (!startTimeControl || !startTimeControl.value || !control.value)
        return null;

      const startTime = CustomTimeValidator.parseTime(startTimeControl.value);
      const endTime = CustomTimeValidator.parseTime(control.value);

      // If either time is invalid, return null
      if (!startTime || !endTime) return null;

      // Check if end time is within one hour of start time
      const timeDifference =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Difference in minutes

      return timeDifference > 0 && timeDifference <= 60
        ? null
        : { invalidEndTime: true };
    };
  }

  private static parseTime(timeString: string): Date | null {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return time;
  }
}
