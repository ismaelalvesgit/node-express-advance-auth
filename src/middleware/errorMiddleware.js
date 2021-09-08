import { 
    InternalServer,
    NotFound, 
    BadRequest, 
    EmailError, 
    Unauthorized,
    ServiceUnavailable,
    ValidadeSchema 
} from "../utils/erro";
import { StatusCodes } from "http-status-codes";
import logger from "../logger";
import elasticAgent from "../apm";

/**
 * @typedef ErrorConfig
 * @type {Object}
 * @property {typeof CodedError} class
 * @property {string} code
 * @property {String} i18n
 */

/**
 * @type {ErrorConfig[]}
 */
const errorsConfigs = [
    { class: Unauthorized, code: "required", i18n: "Unauthorized.required" },
    { class: Unauthorized, code: "user", i18n: "Unauthorized.user" },
    { class: Unauthorized, code: "token.invalid", i18n: "Unauthorized.token.invalid" },
    { class: Unauthorized, code: "token.required", i18n: "Unauthorized.token.required" },
    { class: ServiceUnavailable, code: "router", i18n: "ServiceUnavailable.router" },
    { class: ServiceUnavailable, code: "throttling", i18n: "ServiceUnavailable.throttling" },
    { class: EmailError, code: "email", i18n: "EmailError.email" },


    { class: NotFound, code: null, i18n: "NotFound" },

    { class: BadRequest, code: "User", i18n: "BadRequest.User" },
    { class: BadRequest, code: "Role", i18n: "BadRequest.Role" },
    { class: BadRequest, code: "Scope", i18n: "BadRequest.Scope" },
    { class: BadRequest, code: "Credential", i18n: "BadRequest.Credential" },
    
    { class: InternalServer, code: "User", i18n: "InternalServer.User" },
    { class: InternalServer, code: "Role", i18n: "InternalServer.Role" },
    { class: InternalServer, code: "Scope", i18n: "InternalServer.Scope" },

    { class: ValidadeSchema, code: "any.required", i18n: "ValidadeSchema.required" },
    { class: ValidadeSchema, code: "any.only", i18n: "ValidadeSchema.only" },
    { class: ValidadeSchema, code: "string.min", i18n: "ValidadeSchema.min" },
    { class: ValidadeSchema, code: "string.email", i18n: "ValidadeSchema.email" },
    { class: ValidadeSchema, code: "async.exist", i18n: "ValidadeSchema.async" },
];

/**
 * @param {Error} error
 */
const _getErrorConfig = error => errorsConfigs.find((errorConfig)=>{
    if(error instanceof NotFound && error instanceof errorConfig.class){
        return errorConfig;
    }else{
        if(error instanceof errorConfig.class && error._code === errorConfig.code){
            return errorConfig;
        }
    }
});

/**
 * @param {import('express').Request} req
 * @param {Error} error
 */
/* eslint-disable no-unused-vars*/
const _loadErrorMessage = (req, error) => {
    if(error instanceof ValidadeSchema){
        error.message = JSON.stringify(
            JSON.parse(error.message).map(element => {
                let e = error;
                e._code = element.type;
                const errorConfig = _getErrorConfig(e);
                if(errorConfig){
                    element.message = req.__(errorConfig.i18n, {
                        name: element.context.key,
                        limit: element.context.limit,
                        value: element.context.value,
                        valids: element.context.valids,
                        code: error._code
                    });
                    return element;
                }
                return element;
            })
        );
      }else{
        const errorConfig = _getErrorConfig(error);
        if (errorConfig) {
            const errorWithMessage = error;
            errorWithMessage.message = req.__(errorConfig.i18n, {
                params: req.params,
                query: req.query,
                headers: req.headers,
                body: req.body,
                code: error._code
            });
        }
    }
};

/* eslint-disable no-unused-vars*/
export default function errorHandler(error, req, res, next) {
    logger.error(`${req.id} ${error.message}`);
    _loadErrorMessage(req, error);
    switch (error.constructor) {
        case NotFound:
        case InternalServer:
        case Unauthorized:
        case ServiceUnavailable:
        case BadRequest: {
            res.status(error.statusCode).json([{message: error.message}]);
            break;
        }
        case ValidadeSchema: {
            let response = JSON.parse(error.message).map((i)=>{
                return {
                    name: i.context.key,
                    message: i.message
                };
            });
            res.status(error.statusCode).json(response);
            break;
        }
        case EmailError:{
            res.status(error.statusCode).json([{message: error.message}]);
            break;
        }
        default: {
            if(error.code){
                res.status(StatusCodes.BAD_REQUEST).json([{message: error.sqlMessage}]);
            }else{
                if(elasticAgent){
                    elasticAgent.captureError(error);
                }
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json([{
                    message: req.__("InternalServer", {
                        id: req.id
                    })
                }]);
            }
        }
    }
}