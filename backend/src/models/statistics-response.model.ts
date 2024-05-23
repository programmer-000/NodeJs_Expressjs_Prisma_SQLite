/**
 * This file contains the interfaces for the response of the post count query.
 * The response contains the total number of posts, the number of posts by role, user, category, and status.
 */

// Interface for counting posts by role
export interface RolePostCount {
    role: number;
    count: number;
}

// Interface for counting posts by users
export interface UserPostCount {
    id: number;
    firstName: string;
    lastName: string;
    _count: {
        posts: number;
    };
}

// Interface for counting posts by category
export interface CategoryPostCount {
    id: number;
    name: string;
    _count: {
        posts: number;
    };
}

// Interface for counting posts by status
export interface StatusPostCount {
    published: boolean;
    count: number;
}

// Interface for counting users by role
export interface RoleUserCount {
    role: number;
    count: number;
}

// Interface for counting users by status
export interface StatusUserCount {
    status: boolean;
    count: number;
}

// Interface for counting users by location
export interface LocationUserCount {
    location: string;
    count: number;
}

// Main interface for response
export interface StatisticsResponse {
    totalPosts: number;
    postsByRole: RolePostCount[];
    postsByUser: UserPostCount[];
    postsByCategory: CategoryPostCount[];
    postsByStatus: StatusPostCount[];
    totalUser: number;
    usersByRole: RoleUserCount[];
    usersByStatus: StatusUserCount[];
    usersByLocation: LocationUserCount[];
}
