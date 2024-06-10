import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to check if the date is in the future.
 * @param control The form control to validate
 * @returns A validation error if the date is in the future, otherwise null
 */
export const futureDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const date = new Date(control.value);
  const today = new Date();
  return date > today ? { futureDate: true } : null;
};
