import * as scopeModel from "../model/scope.model";

/**
 * @param {import("../model/scope.model").Scope} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAllScope = (where) =>{
    return scopeModel.findAllScope(where);
};

/**
 * @param {import("../model/scope.model").Scope} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const createScope = (data) =>{
    return scopeModel.createScope(data);
};

/**
 * @param {import("../model/scope.model").Scope} where 
 * @param {import("../model/scope.model").Scope} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const updateScope = (where, data) =>{
    return scopeModel.updateScope(where, data);
};

/**
 * @param {import("../model/scope.model").RoleScope} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const addRoleScope = (data) =>{
    return scopeModel.addRoleScope(data);
};

/**
 * @param {import("../model/scope.model").RoleScope} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const removeRoleScope = (where) =>{
    return scopeModel.removeRoleScope(where);
};