import fs from "fs";
import rimraf from "rimraf";
import shell from "shelljs";
import env from "../env";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcrypt";
/**
 * 
 * @param {string} folder 
 */
export const defaultFolder = (folder)=>{
    if (!fs.existsSync(folder)){
        shell.mkdir("-p", folder);
    }
};

/**
 * @param {string} path 
 */
export const deleteFolder = (path)=>{
    rimraf.sync(path);
};

/**
 * 
 * @param {string} url 
 */
export const deleteFile = (url)=>{
    const file  = url.split(env.system.files.uploadsUrl)[1];
    if(file != "system/default.png"){
        fs.unlinkSync(env.system.files.uploadsPath+file);
    }
};

/**
 * 
 * @param {Object} data 
 * @param {string} time 
 * @returns {string}
 */
export const generateToken = (data, time) =>{
    return jsonwebtoken.sign(data, env.security.secret, {
        expiresIn: time ?? "1h",
    });
};

/**
 * 
 * @param {Object} data 
 * @returns {Object}
 */
export const decryptToken = (data) =>{
    return jsonwebtoken.verify(data, env.security.secret);
};

/**
 * 
 * @param {string} data 
 * @returns {Promise<string}
 */
export const encrypt = (data) =>{
    return bcrypt.hash(data, env.security.saltRounds);
};

/**
 * 
 * @param {string} data 
 * @param {string} encrypted 
 * @returns {Promise<boolean>}
 */
export const compareCrypt = (data, encrypted) =>{
    return bcrypt.compare(data, encrypted);
};
