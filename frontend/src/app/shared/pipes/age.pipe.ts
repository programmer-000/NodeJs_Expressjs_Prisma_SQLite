import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  /**
   * Calculates the age based on the given date of birth.
   * @param dob The date of birth in string or Date format
   * @returns The age calculated from the date of birth
   */
  transform(dob: string | Date): number {
    const today: Date = new Date();
    const birthDate: Date = new Date(dob);

    let age: number = today.getFullYear() - birthDate.getFullYear();
    const monthDiff: number = today.getMonth() - birthDate.getMonth();

    // Adjust age if the current month is before the birth month or if it's the same month but the current day is before the birth day
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

}
