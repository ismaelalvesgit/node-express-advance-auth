import * as clientCredentialsModel from "../model/clientCredentials.model";
import * as roleModel from "../model/role.model";
import * as scopeModel from "../model/scope.model";
import * as userModel from "../model/user.model";
import knex from "../db";
import sourceType from "../enum/sourceType";
import { NotFound } from "../utils/erro";

/**
 * @param {import("../model/clientCredentials.model").ClientCredentials} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAllClientCredentials = async(where) =>{
    const query = await clientCredentialsModel.findAllClientCredentials(where);
    return await Promise.all(query.map(async(element) => {
        if(element.credentials){
            const rolesIds = element.credentials.filter( e => e.source === sourceType.ROLE).map( e => e.reference);
            const scopesIds = element.credentials.filter( e => e.source === sourceType.SCOPE).map( e => e.reference);
            const roles = await roleModel.findbyIds(rolesIds);
            const scopes = await scopeModel.findByIDs(scopesIds);
            Object.assign(element, {
                roles: roles,
                scopes: scopes
            });
        }
        delete element.credentials;
        return element;
    }));
};

/**
 * @param {import("../model/clientCredentials.model").ClientCredentials} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const createClientCredentials = (data) =>{
    return knex.transaction(async(trx)=>{
        const [ user ] = await userModel.findAllUser({id: data.userId}, trx);
        if(!user){
            throw new NotFound({code: "User"});
        }
        if(data.source === sourceType.ROLE){
            const [ role ] = await roleModel.findAllRole({id: data.reference}, trx);
            if(!role){
                throw new NotFound({code: "Role"});
            }
        }else{
            const [ scope ] = await scopeModel.findAllScope({id: data.reference}, trx);
            if(!scope){
                throw new NotFound({code: "Scope"});
            }
        }
        return clientCredentialsModel.createClientCredentials(data, trx);
    });
};

/**
 * @param {import("../model/clientCredentials.model").ClientCredentials} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const removeClientCredentials = (where) =>{
    return clientCredentialsModel.removeClientCredentials(where);
};