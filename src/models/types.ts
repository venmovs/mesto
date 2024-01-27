import { Model, Document } from 'mongoose';
import { Request } from 'express';

export interface IUser {
  _id: string;
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<Document<unknown, any, IUser>>;
}

export interface SessionRequest extends Request {
  user?: {
    _id: string,
  }
}
export interface ICard {
  name: string;
  link: string;
  owner: Object;
  likes: string[];
  createdAt: Date;
}
