import { AccountModel } from './account.model';

export class AuthModel {
  accessToken: string;
  refreshToken: string;
  userInfo: AccountModel;
}
