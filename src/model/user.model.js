import knex from "../db";
import transacting from "../utils/transacting";
const TABLE_NAME = "user";
const SELECT_DEFAULT = ["id", "name", "email", "createdAt", "updatedAt"];
/**
 * @typedef User
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} email
 * @property {String} password
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {User} where 
 * @param {User} select 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findAllUser = (where, trx, select)=>{
    const query = knex(TABLE_NAME)
        .select(select ?? SELECT_DEFAULT)
        .where(where);
    return transacting(query, trx);
};

/**
 * @param {User} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const createUser = (data, trx)=>{
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {User} where 
 * @param {User} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const updateUser = (where, data, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .update(data)
        .forUpdate();
    return transacting(query, trx);
};

/**
 * @param {User} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
export const delUser = (where, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .del();
    return transacting(query, trx);
};