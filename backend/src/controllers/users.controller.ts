import db from '../utils/db';
import { UserModel, UsersModel } from '../models';
import { RoleTypesEnum } from '../enums/role-types.enum';
import { HEAD_SUPER_ADMIN } from '../constants';
import fs from 'fs';

/**
 * Retrieves all users based on provided parameters.
 * @param params - Parameters for filtering, sorting, and pagination.
 * @returns Promise<{ totalCount: number, users: UsersModel[] }> A promise containing total count and list of users.
 */
export const getAllUsersHandler = async (params: any): Promise<{ totalCount: number, users: UsersModel[] }> => {
    const { orderByColumn, orderByDirection, pageIndex, pageSize, firstName, lastName, email, roles } = params;

    // Parse roles from string to array of numbers
    const parseRoles: number[] = JSON.parse(roles);
    const rolesArr: number[] = parseRoles.length ? parseRoles : [RoleTypesEnum.SuperAdmin, RoleTypesEnum.ProjectAdmin, RoleTypesEnum.Manager, RoleTypesEnum.Client];

    // Calculate skip value for pagination
    const skip: number = pageIndex * pageSize;

    // Retrieve total count of users filtered by roles
    const totalCount: number = await db.user.count({
        where: {
            role: { in: rolesArr },
            firstName: { startsWith: firstName },
            lastName: { startsWith: lastName },
            email: { startsWith: email }
        }
    });

    // Retrieve users based on parameters
    const users = await db.user.findMany({
        where: {
            role: { in: rolesArr },
            firstName: { startsWith: firstName },
            lastName: { startsWith: lastName },
            email: { startsWith: email }
        },
        take: parseInt(pageSize),
        skip: skip,
        orderBy: orderByColumn === 'posts' ? {
            posts: {
                _count: orderByDirection
            }
        } : { [orderByColumn]: orderByDirection },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            status: true,
            birthAt: true,
            location: true,
            _count: {
                select: {
                    posts: true
                }
            }
        },
    });

    // Map users to include the posts count directly
    const usersWithPostCount = users.map(user => ({
        ...user,
        postsCount: user._count.posts
    }));

    return { totalCount, users: usersWithPostCount };
};


/**
 * Retrieves a list of all users with minimal information.
 * @returns Promise<{ users: Pick<UsersModel, 'id' | 'firstName' | 'lastName'>[] }> A promise containing the list of users.
 */
export const getListAllUsersHandler = async (): Promise<{ users: Pick<UsersModel, 'id' | 'firstName' | 'lastName'>[] }> => {
    const users = await db.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true
        },
    });
    return { users };
};

/**
 * Retrieves a single user by ID.
 * @param id - ID of the user to retrieve.
 * @returns Promise<UserModel | null> A promise containing the user information.
 */
export const getUserHandler = async (id: number): Promise<UserModel | null> => {
    return db.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            status: true,
            birthAt: true,
            location: true,
            posts: {
                select: {
                    id: true
                },
            },
        },
    });
};

/**
 * Creates a new user.
 * @param user - User information to create.
 * @returns Promise<{ totalCount: number, newUser: UserModel }> A promise containing total count and newly created user.
 */
export const createUserHandler = async (user: UserModel): Promise<any> => {
    const { firstName, lastName, email, password, role, avatar, status, birthAt, location } = user;
    const newUser = await db.user.create({
        data: { firstName, lastName, email, password, role, avatar, status, birthAt, location: location ?? '' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
    const totalCount: number = await db.user.count();
    return { totalCount, newUser };
};

/**
 * Updates an existing user.
 * @param user - Updated user information.
 * @param id - ID of the user to update.
 * @returns Promise<any> A promise containing the updated user information.
 */
export const updateUserHandler = async (user: UserModel, id: number): Promise<any> => {
    const { firstName, lastName, email, role, avatar, status, birthAt, location } = user;
    return db.user.update({
        where: { id },
        data: { firstName, lastName, email, role, avatar, status, birthAt, location },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            status: true,
            birthAt: true,
            location: true,
            posts: {
                select: {
                    id: true
                },
            },
        },
    });
};

/**
 * Updates the password of an existing user.
 * @param userPassword - New password information.
 * @param id - ID of the user whose password to update.
 * @returns Promise<any> A promise containing the updated user information.
 */
export const updateUserPasswordHandler = async (userPassword: any, id: number): Promise<any> => {
    const { password } = userPassword;
    return db.user.update({
        where: { id },
        data: { password },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            status: true
        },
    });
};

/**
 * Deletes a user by ID if the user does not have posts.
 * @param id - ID of the user to delete.
 * @param avatarPath - Path of the user's avatar to delete.
 * @returns Promise<{ success: boolean, message: string }> A promise containing the success status and a message.
 */
export const deleteUserHandler = async (id: number, avatarPath: string): Promise<{ success: boolean, message: string }> => {
    const user = await db.user.findUnique({
        where: { id },
        include: { posts: true },
    });

    if (!user) {
        return { success: false, message: 'User not found' };
    }

    if (user.posts.length > 0) {
        return { success: false, message: 'Cannot delete user with posts' };
    }

    if (user.id === HEAD_SUPER_ADMIN.id && user.role === HEAD_SUPER_ADMIN.role) {
        return { success: false, message: 'Cannot delete the head Super Admin user' };
    }

    if (avatarPath) {
        fs.stat(avatarPath, (err, stats) => {
            if (!err && stats) {
                fs.unlink(avatarPath, err => {
                    if (err) console.error('Error deleting avatar:', err);
                });
            }
        });
    }

    await db.user.delete({ where: { id } });

    return { success: true, message: 'User has been successfully deleted' };
};

/**
 * Finds a user by ID.
 * @param id - ID of the user to find.
 * @returns Promise<UserModel | null> A promise containing the user information or null if not found.
 */
export const findUserById = async (id: number): Promise<UserModel | null> => {
    return db.user.findUnique({ where: { id } });
};
