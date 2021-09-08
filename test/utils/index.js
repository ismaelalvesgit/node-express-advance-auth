import mysql from "mysql2";
import env from "../../src/env";
import { deleteFolder, generateToken } from "../../src/utils";
import knex from "../../src/db";
import { userService, authService, clientCredentialsService, scopeService } from '../../src/services'
import sourceType from "../../src/enum/sourceType";

/**
 * 
 * @param {string} sql 
 */
export const executeSql = (sql)=> {
    return new Promise((resolve, reject)=>{
        const query = mysql.createConnection({
            host: env.db.host,
            user: env.db.user,
            password: env.db.password,
            port: env.db.port,
        });
    
        query.execute(sql, (err, results)=>{
            if(err){
                reject(err);
            }
            resolve(results);
        });
    });
};

/**
 * 
 * @param {Array<string>} paths 
 */
export const deleteFolders = (paths) =>{
    paths.forEach((path)=>{
        deleteFolder(path)
    })
}

/**
 * 
 * @returns {string}
 */
export const tokenAdmin = ()=>{
    return generateToken({isAdmin: true})
}

/**
 * 
 * @param {import('../../src/model/user.model').User} data
 * @returns {{token: string, user: import("../../src/model/user.model").User}}
 */
export const login = async (data) =>{
    let user = await knex('user').first().where({email: data.email})
    if(!user){
        user = await userService.createUser({
            name: "Teste",
            email: data.email,
            password: '123456'
        })
    }
    const client = {
        name: "Teste",
        email: user.email,
        roles: ["user-edit", "user-remove", "user-find"]
    };
    const token = generateToken(client);
    return {token, user}
}


/**
 * 
 * @param {import('../../src/model/user.model').User} data
 * @returns {{rash: string, user: import("../../src/model/user.model").User}}
 */
export const resetPassRash = async (data) =>{
    let user = await knex('user').first().where({email: data.email})
    if(!user){
        user = await userService.createUser({
            name: "Teste",
            email: data.email,
            password: '123456'
        })
    }
    const rash = generateToken({email: user.email}, "5m")
    return {rash, user}
}