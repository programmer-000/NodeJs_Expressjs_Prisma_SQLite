export interface UsersModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: number;
    avatar?: string | null;
    status?: boolean | null;
    birthAt?: Date | null;
    location?: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}
