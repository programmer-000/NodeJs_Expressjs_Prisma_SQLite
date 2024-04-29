export type Admin = {
    id: number;
    email: string; // Changed to lowercase "string"
    firstName: string;
    lastName: string;
    role: number;
};

export const getRootHandler = async (): Promise<Admin[]> => {
    const res: Admin[] = [{
        id: 1,
        email: 'email@email.com',
        firstName: 'Johnny',
        lastName: 'Depp',
        role: 1,
    }];

    console.log('Controller - ROOT');

    return res;
};
