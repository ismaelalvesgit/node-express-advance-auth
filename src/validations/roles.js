import joi from "@hapi/joi";

const httpMethod = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "COPY",
    "HEAD",
    "OPTIONS",
    "LINK",
    "UNLINK",
    "PURGE",
    "LOCK",
    "UNLOCK",
    "PROPFIND",
    "VIEW",
];

export const createRoleShema = joi.object({
    body: joi.object({
        name: joi.string().required(),
        description: joi.string(),
        route: joi.string().required(),
        httpMethod: joi.string().required().valid(...httpMethod)
    }).required(),
});

export const updateRoleShema = joi.object({
    body: joi.object({
        name: joi.string(),
        description: joi.string(),
        route: joi.string(),
        httpMethod: joi.string().valid(...httpMethod)
    })
});