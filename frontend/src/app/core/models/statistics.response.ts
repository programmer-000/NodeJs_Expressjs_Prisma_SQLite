/**
 * This file contains the Models for the response of the post count query.
 * The response contains the total number of posts, the number of posts by role, user, category, and status.
 */

export class RolePostCount {
  role: number;
  count: number;
}

// Model for counting posts by users
export class UserPostCount {
  id: number;
  firstName: string;
  lastName: string;
  _count: {
    posts: number;
  };
}

// Model for counting posts by category
export class CategoryPostCount {
  id: number;
  name: string;
  _count: {
    posts: number;
  };
}

// Model for counting posts by status
export class StatusPostCount {
  published: boolean;
  count: number;
}

// Interface for counting users by role
export class RoleUserCount {
  role: number;
  count: number;
}

// Interface for counting users by status
export class StatusUserCount {
  status: boolean;
  count: number;
}

// Interface for counting users by location
export class LocationUserCount {
  location: string;
  count: number;
}

// Main class for response
export class StatisticsResponse {
  totalPosts?: number;
  postsByRole?: RolePostCount[];
  postsByUser?: UserPostCount[];
  postsByCategory?: CategoryPostCount[];
  postsByStatus?: StatusPostCount[];
  totalUser?: number;
  usersByRole?: RoleUserCount[];
  usersByStatus?: StatusUserCount[];
  usersByLocation?: LocationUserCount[];
}

