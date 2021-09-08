import joi from "@hapi/joi";

export const createUserShema = joi.object({
    body: joi.object({
        name: joi.string().required(),
        password: joi.string().required().min(6),
        email: joi.string().email().required(),
    }).required(),
});

export const updateUserShema = joi.object({
    body: joi.object({
        name: joi.string(),
        password: joi.string().min(6),
        email: joi.string().email(),
    }),
});