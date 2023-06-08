import { Types } from 'mongoose';

export type AuthorType = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
};

export type CommentType = {
  id: string;
  author: AuthorType;
  text: string;
  numberLikes: number;
  createdAt: Date;
  updatedAt: Date;
};
