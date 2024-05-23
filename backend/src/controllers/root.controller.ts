import db from '../utils/db';

/**
 * Fake root controller
 * @api {get} /root Get Root
 */
export const getRootHandler = async (): Promise<any[]> => {
    return [{
        id: 1,
        email: 'email@email.com',
        firstName: 'Johnny',
        lastName: 'Depp',
        role: 1,
    }];
};
