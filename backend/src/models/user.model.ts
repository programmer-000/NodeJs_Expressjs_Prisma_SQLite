import { RefreshToken } from './refresh-token.model';
import { PasswordResetTokenModel } from './password-reset-token.model';

export interface UserModel {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    role: number;
    avatar?: string | null;
    status?: boolean | null;
    birthAt?: Date | null;
    location?: string;
    refreshTokens?: RefreshToken[];
    passwordResetToken?: PasswordResetTokenModel[];
}
