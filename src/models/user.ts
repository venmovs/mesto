import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './types';
import { ERROR_MESSAGE_LOGIN_DATA } from '../helpers/constants/messages';

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: ERROR_MESSAGE_LOGIN_DATA,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function (email: string, password: string) {
  return this.findOne({ email })
    .select('+password')
    .then((user: IUser | undefined) => {
      if (!user) {
        return Promise.reject(new Error(ERROR_MESSAGE_LOGIN_DATA));
      }

      return bcrypt.compare(password, user.password)
        .then((matched: boolean) => {
          if (!matched) {
            return Promise.reject(new Error(ERROR_MESSAGE_LOGIN_DATA));
          }

          return user;
        });
    });
});

export default model<IUser, UserModel>('user', userSchema);
