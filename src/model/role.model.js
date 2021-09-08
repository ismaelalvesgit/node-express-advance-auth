import knex from "../db";
import transacting from "../utils/transacting";
const TABLE_NAME = "role";
/**
 * @typedef Role
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 * @property {String} route
 * @property {String} httpMethod
 * @property {String} status
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {Array<number>} where 
 * @param {Role} select 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findbyIds = (where, trx)=>{
    const query = knex(TABLE_NAME)
        .whereIn("id", where)
        .orderBy("status", "asc");
    return transacting(query, trx);
};

/**
 * @param {Role} where 
 * @param {Role} select 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findAllRole = (where, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .orderBy("status", "asc");
    return transacting(query, trx);
};

/**
 * @param {Role} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const createRole = (data, trx)=>{
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {Role} where 
 * @param {Role} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const updateRole = (where, data, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .update(data)
        .forUpdate();
    return transacting(query, trx);
};
