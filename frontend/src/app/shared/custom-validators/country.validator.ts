import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { COUNTRIES } from '../constants/countries';

/**
 * Validator to check if the country exists in the list of countries
 * @returns A validation error if the country is not found, otherwise null
 */
export function countryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const country = control.value;
    if (!country) {
      return { countryNotFound: true };
    }
    const countryExists = COUNTRIES.some(c => c.name.toLowerCase() === country.toLowerCase());
    return countryExists ? null : { countryNotFound: true };
  };
}
