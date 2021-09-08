import { ValidadeSchema } from "../utils/erro";
import { ValidationError } from "@hapi/joi";
/**
 * 
 * @param {import('@hapi/joi').AnySchema} schema 
 * @param {boolean} async 
 * @returns 
 */
export default function verifyHandlerMiddleware(schema){
    return async(req, res, next)=>{
        try {
            const validation = await schema.validateAsync(req, {
                abortEarly: false,
                stripUnknown: true,
                allowUnknown: true
            });

            if(validation){
                const erros = [];
                if(validation.body){
                    Object.values(validation.body).forEach((e)=>{
                        if(e instanceof ValidadeSchema){
                            erros.push(JSON.parse(e.message));
                        }
                    });
                }

                if(validation.params){
                    Object.values(validation.params).forEach((e)=>{
                        if(e instanceof ValidadeSchema){
                            erros.push(JSON.parse(e.message));
                        }
                    });
                }

                if(validation.headers){
                    Object.values(validation.headers).forEach((e)=>{
                        if(e instanceof ValidadeSchema){
                            erros.push(JSON.parse(e.message));
                        }
                    });
                }
                if(erros.length > 0){
                    next(new ValidadeSchema(erros));
                }else{
                    next();
                }
            }else{
                next();
            }
        } catch (error) {
            if(error instanceof ValidationError){
                next(new ValidadeSchema(error.details));
            }
            next(error);
        }
    };
}