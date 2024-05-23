/**
 * RoleTransform function to transform the numeric role value to a string representation
 * @param value
 * @constructor
 */
export function roleTransform(value: number): string {
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
