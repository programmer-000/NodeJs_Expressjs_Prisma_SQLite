import { AbstractControl } from '@angular/forms';

/**
 * Custom validator to ensure two form controls have matching values
 * @param controlName The name of the control to match
 * @param matchingControlName The name of the control to match against
 * @returns A validation function
 */
export function MustMatch(controlName: string, matchingControlName: string) {
  return (group: AbstractControl) => {
    // Get the form controls from the form group
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);

    // If either control is missing, return null (no validation errors)
    if (!control || !matchingControl) {
      return null;
    }

    // If the matching control doesn't have the mustMatch error, return null (no validation errors)
    if (matchingControl.errors && !matchingControl.errors?.['mustMatch']) {
      return null;
    }

    // If the values of the two controls don't match, set the mustMatch error on the matching control
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      // If the values match, clear any existing mustMatch error on the matching control
      matchingControl.setErrors(null);
    }
    return null; // Return null (no validation errors)
  }
}
