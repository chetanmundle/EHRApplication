import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function timeValidator(dateControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedTime = control.value;
    const selectedDate = new Date(dateControl.value);
    const currentDate = new Date();

    if (!selectedTime || !dateControl.value) return null;

    // If selected date is today, check that the time is at least 1 hour ahead of current time
    if (selectedDate.toDateString() === currentDate.toDateString()) {
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + 60); // Add 1 hour

      const selectedTimeDate = new Date(selectedDate);
      const [hours, minutes] = selectedTime
        .split(':')
        .map((v: any) => parseInt(v, 10));

      selectedTimeDate.setHours(hours);
      selectedTimeDate.setMinutes(minutes);

      if (selectedTimeDate < currentTime) {
        return {
          invalidTime:
            'Time must be at least 1 hour ahead of the current time.',
        };
      }
    }

    return null;
  };
}
