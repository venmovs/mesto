import { celebrate, Joi } from 'celebrate';

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const avatarRegexp = /^https?:\/\/(www\.)?([\w-]+\.['w+])\s*$/;
const validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().regex(avatarRegexp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
  }),
});

const validateAvatar = celebrate({
  body: {
    avatar: Joi.string().regex(avatarRegexp),
  },
});

const validateId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex(),
  }),
});

const validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(avatarRegexp),
  }),
});

const validator = {
  validateLogin,
  validateUser,
  validateUserInfo,
  validateAvatar,
  validateCard,
  validateId,
};

export default validator;
