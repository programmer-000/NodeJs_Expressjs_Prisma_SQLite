import { RoleTypesEnum } from '../enums/role-types.enum';

/**
 * Object that maps each role to an array of permissions.
 * The key is the role, and the value is an array of permissions granted to that role.
 * A permission of '*' indicates that the role has access to all actions.
 */
export const roles: { [key in RoleTypesEnum]: string[] } = {
    [RoleTypesEnum.SuperAdmin]: ['*'],
    [RoleTypesEnum.ProjectAdmin]: [
        'GET_USERS',
        'CREATE_USER',
        'UPDATE_USER',
        'DELETE_USER',

        'CREATE_CATEGORY',
        'UPDATE_CATEGORY',
        'DELETE_CATEGORY'
    ],
    [RoleTypesEnum.Manager]: [
        'GET_USERS',

        'CREATE_CATEGORY',
        'UPDATE_CATEGORY',
        'DELETE_CATEGORY'
    ],
    [RoleTypesEnum.Client]: [

    ]
};
