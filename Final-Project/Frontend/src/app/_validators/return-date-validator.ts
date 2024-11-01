import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function returnDateValidator(data: { flightType: string }): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const departDate: Date | null = group.get('departDate')?.value;
    const returnDate: Date | null = group.get('returnDate')?.value;

    const validDates =
      (data.flightType == 'one' && departDate) ||
      (data.flightType == 'round' &&
        returnDate &&
        departDate &&
        returnDate >= departDate);
    return !validDates ? { invalidDate: { value: false } } : null;
  };
}
