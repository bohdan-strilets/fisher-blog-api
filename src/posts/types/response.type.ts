import { PostDocument } from '../schemas/post.schema';

export type ResponseType<P = PostDocument | PostDocument[]> = {
  status: string;
  code: number;
  success: boolean;
  data?: P;
};
