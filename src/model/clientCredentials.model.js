import knex from "../db";
import R from "ramda";
import transacting from "../utils/transacting";
const TABLE_NAME = "clientCredentials";
const TABLE_NAME_USER = "user";
const SELECT_USER = ["user.id", "user.name", "user.email", "user.createdAt", "user.updatedAt"];

/**
 * @typedef ClientCredentials
 * @type {Object}
 * @property {Number} userId
 * @property {import("./user.model").User} user
 * @property {Number} reference
 * @property {String} source
 * @property {import("./role.model").Role | import("./scope.model").Scope} result
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {ClientCredentials} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findAllClientCredentials = (where, trx)=>{
    const query = knex(TABLE_NAME_USER)
    .select([
        ...SELECT_USER,
        knex.raw(`
            JSON_ARRAYAGG(JSON_OBJECT(
                'reference', clientCredentials.reference,
                'source', clientCredentials.source, 
                'createdAt', clientCredentials.createdAt, 
                'updatedAt', clientCredentials.updatedAt
            )) as credentials
        `)
    ])
    .innerJoin(`${TABLE_NAME}`, `${TABLE_NAME}.userId`, `${TABLE_NAME_USER}.id`)
    .where(R.reject(R.isNil, {
        "user.id": where?.id,
        "user.name": where?.name,
        "user.email": where?.email,
        "user.createdAt": where?.createdAt,
        "user.updatedAt": where?.updatedAt
    }))
    .groupBy("user.email");

    return transacting(query, trx);
};


/**
 * @param {ClientCredentials} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const createClientCredentials = (data, trx)=>{
    const query = knex(TABLE_NAME)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {ClientCredentials} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const removeClientCredentials = (data, trx)=>{
    const query = knex(TABLE_NAME)
        .where(data)
        .del();
    return transacting(query, trx);
};
