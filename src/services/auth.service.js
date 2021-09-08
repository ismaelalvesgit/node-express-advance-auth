import { RateLimiterMemory } from "rate-limiter-flexible";
import * as userModel from "../model/user.model";
import * as historyModel from "../model/loginHistory.model";
import {  compareCrypt, generateToken, decryptToken } from "../utils";
import { resetPass } from "../utils/mail";
import { NotFound, ServiceUnavailable, Unauthorized } from "../utils/erro";
import { clientCredentialsService, userService } from "../services";

const maxResetPassByminute = 3;
const maxLoginByMinute = 6;
const maxLoginByDay = 100;
const limitIpResetPassByMinute = new RateLimiterMemory({
    keyPrefix: "limitIPResetPassByMinute",
    points: maxLoginByMinute,
    duration: 60,
    blockDuration: 60 * 60 * 24, //Bloqueie por 1 dia, se 6 tentativas erradas a cada 1 minuto
});
const limitIpLoginByMinute = new RateLimiterMemory({
    keyPrefix: "limitIPLoginByMinute",
    points: maxLoginByMinute,
    duration: 30,
    blockDuration: 60 * 10, // Bloqueie por 10 minutos, se 6 tentativas erradas a cada 30 segundos
});
const limitIpLoginByDay = new RateLimiterMemory({
    keyPrefix: "limitIPLoginByDay",
    points: maxLoginByDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, //Bloqueie por 1 dia, se 100 tentativas erradas por dia
});

/**
 * @param {import("../model/user.model").User} data 
 * @param {string} ipAddr
 * @returns {{token: string, user: import("../model/user.model").User}}
 */
export const login = async(data, ipAddr) =>{
    const [resFastByIP, resSlowByIP] = await Promise.all([
        limitIpLoginByMinute.get(ipAddr),
        limitIpLoginByDay.get(ipAddr),
    ]);
    let retrySecs = 0;
    // Verifique se o IP já está bloqueado
    if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxLoginByDay) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (resFastByIP !== null && resFastByIP.consumedPoints > maxLoginByMinute) {
        retrySecs = Math.round(resFastByIP.msBeforeNext / 1000) || 1;
    }

    if(retrySecs > 0){
        throw new ServiceUnavailable({code: "throttling"});
    }else{
        const [ user ] = await userModel.findAllUser({email: data.email}, undefined, "*");
        if(user){
            const checkPassword = await compareCrypt(data.password, user.password);
            if(checkPassword){
                let allRoles = [];
                const [ credential ] = await clientCredentialsService.findAllClientCredentials({userId: user.id});
                if(credential?.roles){
                    allRoles = credential.roles.map((e => e.name));
                }
                if(credential?.scopes){
                    const rolesTemp = credential.scopes.map((e) => e.roles);
                    rolesTemp.forEach(element => {
                        if(element){
                            allRoles.concat(element.map(e => e.name));
                        }
                    });
                }

                const client = {
                    name: user.name,
                    email: user.email,
                    roles: allRoles
                };
                delete user.password;

                const token = generateToken(client);
                return {token: token, user};
            }else{
                await Promise.all([
                    limitIpLoginByMinute.consume(ipAddr),
                    limitIpLoginByDay.consume(ipAddr),
                ]);
                throw new Unauthorized({code: "user"});
            }
        }else{
            await Promise.all([
                limitIpLoginByMinute.consume(ipAddr),
                limitIpLoginByDay.consume(ipAddr),
            ]);
            throw new Unauthorized({code: "user"});
        }
    }
};

/**
 * 
 * @param {import("../model/user.model").User} user 
 * @param {import('express-useragent').Details} userAgent 
 */
export const createHistory = async(user, userAgent) =>{
    return historyModel.createHistory({
        userId: user.id,
        ipAddress: userAgent.ipAddress,
        browser: userAgent.browser,
        version: userAgent.version,
        os: userAgent.os,
        platform: userAgent.platform,
        source: userAgent.source,
        userAgent: JSON.stringify(userAgent),
        geoIp: userAgent.geoIp,
    });
};

/**
 * @param {import("../model/user.model").User} data 
 * @param {string} ipAddr
 * @returns {{rash: string, user: import("../model/user.model").User}}
 */
export const resetPassword = async(data, ipAddr) =>{
    const resFastByIP = await limitIpResetPassByMinute.get(ipAddr);
    let retrySecs = 0;
    // Verifique se o IP já está bloqueado
    if (resFastByIP !== null && resFastByIP.consumedPoints > maxResetPassByminute) {
        retrySecs = Math.round(resFastByIP.msBeforeNext / 1000) || 1;
    } 
    if (retrySecs > 0) {
        throw new ServiceUnavailable({code: "throttling"});
    } else {
        try {
            const [ user ] = await userModel.findAllUser({email: data.email});
            const rash = generateToken({email: user.email}, "5m");
            await resetPass(user, rash);
            return {user, rash};
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFound({code: "user"});
            } else {
                throw new ServiceUnavailable({code: "throttling"});
            } 
        }
    }
};

/**
 * 
 * @param {string} data 
 * @returns {import("../model/user.model").User} 
 */
export const checkLink = async(data) =>{
    const decode = decryptToken(data);
    const [ user ] = await userModel.findAllUser({email: decode.email});
    if(user){
        user["rash"] = data;
        return user;
    }else{
        throw new Error("Link expired");
    }
};

/**
 * 
 * @param {string} data 
 * @param {string} newPassword 
 * @returns {import("../model/user.model").User} 
 */
export const changePassword = async(data, newPassword) =>{
    const decode = decryptToken(data);
    const user = await userService.updateUser({email: decode.email}, {password: newPassword});
    if(user != 1){
        throw new Error("Fail to update");
    }else{
        return user;
    }
};
