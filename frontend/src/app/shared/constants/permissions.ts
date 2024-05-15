/**
 * Permissions
 * @description This permission template can be used throughout the site
 */
export const PAGE_PERMISSIONS = {
  create: true,
  edit: true,
  delete: true,
  DIALOG: {
    status: true
  }
};

/**
 * At the moment only "PAGE_USERS_MANAGER elements: false" is used
 */
const PAGE_USERS_MANAGER = {
  ...PAGE_PERMISSIONS,
  DIALOG: {
    ...PAGE_PERMISSIONS.DIALOG,
    elements: false
  }
};

const PAGE_USERS_CLIENT = {
  create: true,
  edit: false,
  delete: false,
  DIALOG: {
    status: true
  }
};

const PAGE_POSTS_MANAGER = {
  ...PAGE_PERMISSIONS,
  delete: false
};

const PAGE_POSTS_CLIENT = {
  create: true,
  edit: false,
  delete: false,
  DIALOG: {
    status: true
  }
};

/**
 * Permissions for each role in the system (SUPER_ADMIN, PROJECT_ADMIN, MANAGER, CLIENT)
 */
export const PERMISSIONS = {
  SUPER_ADMIN: {
    PAGE_USERS: { ...PAGE_PERMISSIONS },
    PAGE_POSTS: { ...PAGE_PERMISSIONS }
  },
  PROJECT_ADMIN: {
    PAGE_USERS: { ...PAGE_PERMISSIONS },
    PAGE_POSTS: { ...PAGE_PERMISSIONS }
  },
  MANAGER: {
    PAGE_USERS: { ...PAGE_USERS_MANAGER },
    PAGE_POSTS: { ...PAGE_POSTS_MANAGER }
  },
  CLIENT: {
    PAGE_USERS: { ...PAGE_USERS_CLIENT },
    PAGE_POSTS: { ...PAGE_POSTS_CLIENT }
  }
}
