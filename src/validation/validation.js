import Joi from "joi-browser";

//Schema for validating user auth
export const authSchema = Joi.object().keys({
  login: Joi.string()
    .min(3)
    .max(16)
    .regex(/^\S+$/)
    .required(),
  password: Joi.string()
    .min(3)
    .max(20)
    .required()
    .required()
});
