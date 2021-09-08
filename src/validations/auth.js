import joi from "@hapi/joi";

export const loginShema = joi.object({
    body: joi.object({
        password: joi.string().required().min(6),
        email: joi.string().email().required(),
    }).required(),
});

export const resetPassShema = joi.object({
    body: joi.object({
        email: joi.string().email().required(),
    }).required(),
});

export const changePassShema = joi.object({
    body: joi.object({
        password: joi.string().min(6),
    }).required(),
});