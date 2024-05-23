import db from '../utils/db';
import { StatisticsResponse, RolePostCount } from '../models';

/**
 * Retrieves post counts and user counts by various criteria.
 * @returns An object containing counts by total, role, user, category, status, and location.
 */
export const getStatisticsHandler = async (): Promise<StatisticsResponse> => {
    // Total number of posts
    const totalPosts = await db.post.count();

    // Number of posts by roles
    const usersWithPosts = await db.user.findMany({
        select: {
            role: true,
            _count: {
                select: { posts: true }
            }
        }
    });

    // Initialize aggregated object
    const postsByRole: Record<number, RolePostCount> = {};

    usersWithPosts.forEach(user => {
        const role = user.role;
        if (!postsByRole[role]) {
            postsByRole[role] = { role, count: 0 };
        }
        postsByRole[role].count += user._count.posts;
    });

    // Convert object to array
    const postsByRoleArray = Object.values(postsByRole);

    // Number of posts by users
    const postsByUser = await db.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            _count: {
                select: { posts: true }
            }
        }
    });

    // Number of posts by categories
    const postsByCategory = await db.category.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: { posts: true }
            }
        }
    });

    // Number of posts by status
    const postsByStatus = await db.post.groupBy({
        by: ['published'],
        _count: {
            _all: true
        }
    });

    // Total number of users
    const totalUser = await db.user.count();

    // Number of users by role
    const usersByRole = await db.user.groupBy({
        by: ['role'],
        _count: {
            _all: true
        }
    });

    // Number of users by status
    const usersByStatus = await db.user.groupBy({
        by: ['status'],
        _count: {
            _all: true
        }
    });

    // Number of users by location
    const usersByLocation = await db.user.groupBy({
        by: ['location'],
        _count: {
            _all: true
        }
    });

    return {
        // Add post counts
        totalPosts,
        postsByRole: postsByRoleArray,
        postsByUser,
        postsByCategory,
        postsByStatus: postsByStatus.map(status => ({
            published: status.published,
            count: status._count._all
        })),

        // Add user counts
        totalUser,
        usersByRole: usersByRole.map(role => ({
            role: role.role,
            count: role._count._all
        })),
        usersByStatus: usersByStatus
            .filter(status => status.status !== null)  // Filter out null values
            .map(status => ({
                status: status.status as boolean,  // Cast status to boolean
                count: status._count._all
            })),
        usersByLocation: usersByLocation.map(location => ({
            location: location.location,
            count: location._count._all
        }))
    };
};
