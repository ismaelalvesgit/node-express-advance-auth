import knex from "../db";
import transacting from "../utils/transacting";
const TABLE_NAME = "loginHistory";
/**
 * @typedef loginHistory
 * @type {Object}
 * @property {Number} id
 * 
 * @property {Number} userId
 * @property {import("./user.model").User} user
 * @property {Object} userAgent
 * @property {Object} geoIp
 * @property {String} ipAddress
 * @property {String} browser
 * @property {String} version
 * @property {String} os
 * @property {String} platform
 * @property {String} source
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {loginHistory} where 
 * @param {loginHistory} select 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findAllHistory = (where, trx)=>{
    const query = knex(TABLE_NAME)
        .where(where)
        .orderBy("status", "asc");
    return transacting(query, trx);
};

/**
 * @param {loginHistory} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const createHistory = (data, trx)=>{
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

