import joi from "@hapi/joi";

export const emailShema = joi.object({
    body: joi.object({
        email: joi.string().email().required(),
    }).required(),
});

