import knex from "../db";
import R from "ramda";
import transacting from "../utils/transacting";
const TABLE_NAME_SCOPE = "scope";
const TABLE_NAME_ROLE_SCOPE = "roleScope";

/**
 * @typedef Scope
 * @type {Object}
 * @property {Number} id
 * @property {String} name
 * @property {String} description
 * @property {String} status
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @typedef RoleScope
 * @type {Object}
 * @property {Number} roleId
 * @property {import("./role.model").Role} role
 * @property {Number} scopeId
 * @property {Scope} scope
 * @property {String} createdAt
 * @property {String} updatedAt
 */

/**
 * @param {Array<number} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findByIDs = (where, trx)=>{
    const query = knex(TABLE_NAME_SCOPE)
        .select([
            "scope.*",
            knex.raw(`
                CASE WHEN role.id IS NOT NULL
                    THEN JSON_ARRAYAGG(JSON_OBJECT(
                        'id', role.id,
                        'name', role.name, 
                        'description', role.description, 
                        'route', role.route, 
                        'httpMethod', role.httpMethod, 
                        'status', role.status, 
                        'createdAt', role.createdAt, 
                        'updatedAt', role.updatedAt
                    ))
                ELSE NULL
                END AS roles
            `)
        ])
        .leftJoin(`${TABLE_NAME_ROLE_SCOPE}`, "scope.id", `${TABLE_NAME_ROLE_SCOPE}.scopeId`)
        .leftJoin("role", "role.id", `${TABLE_NAME_ROLE_SCOPE}.roleId`)
        .whereIn("scope.id", where)
        .groupBy("scope.name")
        .orderBy("scope.status", "asc");
    return transacting(query, trx);
};

/**
 * @param {RoleScope} where 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const findAllScope = (where, trx)=>{
    const query = knex(TABLE_NAME_SCOPE)
        .select([
            "scope.*",
            knex.raw(`
                CASE WHEN role.id IS NOT NULL
                    THEN JSON_ARRAYAGG(JSON_OBJECT(
                        'id', role.id,
                        'name', role.name, 
                        'description', role.description, 
                        'route', role.route, 
                        'httpMethod', role.httpMethod, 
                        'status', role.status, 
                        'createdAt', role.createdAt, 
                        'updatedAt', role.updatedAt
                    ))
                ELSE NULL
                END AS roles
            `)
        ])
        .leftJoin(`${TABLE_NAME_ROLE_SCOPE}`, "scope.id", `${TABLE_NAME_ROLE_SCOPE}.scopeId`)
        .leftJoin("role", "role.id", `${TABLE_NAME_ROLE_SCOPE}.roleId`)
        .where(R.reject(R.isNil, {
            "scope.id": where?.id,
            "scope.name": where?.name,
            "scope.description": where?.description,
            "scope.status": where?.status,
            "scope.createdAt": where?.createdAt,
            "scope.updatedAt": where?.updatedAt
        }))
        .groupBy("scope.name")
        .orderBy("scope.status", "asc");
    return transacting(query, trx);
};

/**
 * @param {Scope} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const createScope = (data, trx)=>{
    const query = knex(TABLE_NAME_SCOPE)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {Scope} where 
 * @param {Scope} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const updateScope = (where, data, trx)=>{
    const query = knex(TABLE_NAME_SCOPE)
        .where(where)
        .update(data)
        .forUpdate();
    return transacting(query, trx);
};

/**
 * @param {RoleScope} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const addRoleScope = (data, trx)=>{
    const query = knex(TABLE_NAME_ROLE_SCOPE)
        .insert(data);
    return transacting(query, trx);
};

/**
 * @param {RoleScope} data 
 * @param {import('knex').Knex.Transaction} trx 
 * @returns {import('knex').Knex.QueryBuilder}
 */
 export const removeRoleScope = (data, trx)=>{
    const query = knex(TABLE_NAME_ROLE_SCOPE)
        .where(data)
        .del();
    return transacting(query, trx);
};

