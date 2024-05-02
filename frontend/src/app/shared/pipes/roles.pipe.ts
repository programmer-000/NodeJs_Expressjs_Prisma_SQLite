import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roles'
})
export class RolesPipe implements PipeTransform {

  /**
   * Transforms a numeric value representing a user role into a string representation.
   * @param value The numeric value representing the user role
   * @returns The string representation of the user role
   */
  transform(value: number): string {
    // Check the numeric value and return the corresponding role string
    switch (value) {
      case 1:
        return 'Super Admin';
      case 2:
        return 'Project Admin';
      case 3:
        return 'Manager';
      case 4:
        return 'Client';
      default:
        return '';
    }
  }
}
