export interface RefreshToken {
    id: string;
    hashedToken: string;
    userId: number;
    revoked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
