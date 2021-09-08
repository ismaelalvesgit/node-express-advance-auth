import * as roleModel from "../model/role.model";

/**
 * @param {import("../model/role.model").Role} where 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const findAllRole = (where) =>{
    return roleModel.findAllRole(where);
};

/**
 * @param {import("../model/role.model").Role} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const createRole = (data) =>{
    return roleModel.createRole(data);
};

/**
 * @param {import("../model/role.model").Role} where 
 * @param {import("../model/role.model").Role} data 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const updateRole = (where, data) =>{
    return roleModel.updateRole(where, data);
};