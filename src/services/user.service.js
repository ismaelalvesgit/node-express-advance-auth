import * as userModel from "../model/user.model";
import * as scopeModel from "../model/scope.model";
import * as clientCredentialsModel from "../model/clientCredentials.model";
import { encrypt } from "../utils";
import knex from "../db";
import sourceType from "../enum/sourceType";

/**
 * @param {import("../model/user.model").User} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAllUser = (where) =>{
    return userModel.findAllUser(where);
};

/**
 * @param {import("../model/user.model").User} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const createUser = async (data) =>{
    data.password = await encrypt(data.password);
    return knex.transaction(async (trx)=>{
        await userModel.createUser(data, trx);
        const [ user ] = await userModel.findAllUser({email: data.email}, trx);
        const [ scope ] = await scopeModel.findAllScope({name: "user-manager"}, trx);
        if(scope){
            await clientCredentialsModel.createClientCredentials({
                userId: user.id,
                reference: scope.id,
                source: sourceType.SCOPE
            }, trx);
        } 
        return user;
    });
};

/**
 * @param {import("../model/user.model").User} where 
 * @param {import("../model/user.model").User} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const updateUser = async (where, data) =>{
    if(data?.password){
        data.password = await encrypt(data.password);
    }
    return userModel.updateUser(where, data);
};

/**
 * @param {import("../model/user.model").User} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const delUser = (where) =>{
    return userModel.delUser(where);
};