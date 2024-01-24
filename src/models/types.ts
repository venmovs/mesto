export interface IUser {
  id: string;
  name: string;
  about: string;
  avatar: string;
}

export interface ICard {
  name: string;
  link: string;
  owner: Object;
  likes: string[];
  createdAt: Date;
}
