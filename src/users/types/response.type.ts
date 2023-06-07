import { User } from 'src/users/schemas/user.schema';

export type ResponseType<U = User | User[]> = {
  status: string;
  code: number;
  success: boolean;
  message?: string;
  data?: U;
};
