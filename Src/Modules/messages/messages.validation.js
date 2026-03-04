import Joi from "joi"
export const messagesSchema= Joi.object(
    {
        message: Joi.string().min(2).required()
    }
)