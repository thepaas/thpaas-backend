import { UserStatus } from '../enums/user';

export type UserPayload = {
  email: string;
  userId: number;
  status: UserStatus;
};
