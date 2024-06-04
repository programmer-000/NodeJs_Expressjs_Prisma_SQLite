/**
 * @description: This file is used to export all the validators
 */

// Main error handler
export * from './handle-errors-validator';

// User validators
export * from './users/get-users-validator';
export * from './users/create-user-validator';
export * from './users/update-user-validator';
export * from './posts/update-password-validator';

// Auth validators
export * from './auth/register-validate';
export * from './auth/login-user-validator';
export * from './auth/refresh-token-validator';
export * from './auth/revoke-refresh-token-validator';
export * from './auth/current-password-validator';
export * from './auth/verify-email-validator';
export * from './auth/reset-password-link-validator';
export * from './auth/change-password-validator';

// Category validators
export * from './categories/create-category-validator';
export * from './categories/update-category-validator';

// Post validators
export * from './posts/get-posts-validator';
export * from './posts/create-post-validator';
export * from './posts/update-post-validator';
