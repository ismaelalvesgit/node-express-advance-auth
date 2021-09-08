import joi from "@hapi/joi";
import { roleService, scopeService } from "../services";
import { ValidadeSchema } from "../utils/erro";

/**
 * 
 * @param {any} value 
 */
const _checkRoleExist = async(value)=>{
    const [ role ] = await roleService.findAllRole({id: value});
    if(role){
        return true;
    }else{
        return new ValidadeSchema({
            context:{
                key: "roleId",
                value,
            },
            type: "async.exist",
            message: "Role not exist"
        });
    }
};

/**
 * 
 * @param {any} value 
 */
const _checkScopeExist = async(value)=>{
    const [ scope ] = await scopeService.findAllScope({id: value});
    if(scope){
        return true;
    }else{
        return new ValidadeSchema({
            context:{
                key: "id",
                value,
            },
            type: "async.exist",
            message: "Scope not exist"
        });
    }
};

export const createScopeShema = joi.object({
    body: joi.object({
        name: joi.string().required(),
        description: joi.string(),
    }).required(),
});

export const updateScopeShema = joi.object({
    body: joi.object({
        name: joi.string(),
        description: joi.string()
    })
});

export const roleScopeShema = joi.object({
    params: joi.object({
        id: joi.string().external(_checkScopeExist).required()
    }),
    body: joi.object({
        roleId: joi.number().external(_checkRoleExist).required()
    }).required()
});

