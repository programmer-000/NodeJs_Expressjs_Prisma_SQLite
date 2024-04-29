import { UserModel } from './user.model';

export interface PasswordResetTokenModel {
    id: number;
    resetToken: string;
    userId: number;
    expireTime: Date;
    user?: UserModel;
}
