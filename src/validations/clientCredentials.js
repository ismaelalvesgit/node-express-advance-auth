import joi from "@hapi/joi";
import sourceType from "../enum/sourceType";

export const clientCredentials = joi.object({
    body: joi.object({
        userId: joi.number().required(),
        reference: joi.number().required(),
        source: joi.string().valid(...Object.keys(sourceType)).required()
    }).required()
});
