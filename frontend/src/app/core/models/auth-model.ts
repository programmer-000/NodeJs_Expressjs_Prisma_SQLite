import { AuthUserModel } from './auth-user.model';

export class AuthModel {
  accessToken: string;
  refreshToken: string;
  userInfo: AuthUserModel;
}
