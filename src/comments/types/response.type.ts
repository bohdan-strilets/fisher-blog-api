import { CommentDocument } from '../schemas/comment.schema';

export type ResponseType<C = CommentDocument | CommentDocument[]> = {
  status: string;
  code: number;
  success: boolean;
  data?: C;
};
