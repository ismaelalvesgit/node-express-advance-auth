import catchAsync from "../utils/catchAsync";
import { authService } from "../services";
import logger from "../logger";
import { lookup } from "geoip-lite";
import env from "../env";

export const login = catchAsync(async (req, res) =>{
    const data = req.body;
    const ipAddr = req.ip;
    const result = await authService.login(data, ipAddr);
    try {
        let userAgent = req.useragent;
        userAgent["ipAddress"] = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        userAgent["geoIp"] = lookup(userAgent.ipAddress);
        authService.createHistory(result.user, userAgent).then();
    } catch (error) {logger.warn(error);}
    res.json(result);
});

export const resetPassword = catchAsync(async (req, res) =>{
    const data = req.body;
    const ipAddr = req.ip;
    await authService.resetPassword(data, ipAddr);
    res.json({result:  req.__("User.create")});
});

export const checkLink = catchAsync(async (req, res) =>{
    try {
        const data = req.params.rash;
        const user = await authService.checkLink(data);
        res.render("resetPass", {data: user, action:"alter", url: env.server.url});
    } catch (error) {
        res.status(403).render("resetPass", {data: null, action:"not-found", url: env.server.url});
    }
});

export const changePassword = catchAsync(async (req, res) =>{
    try {
        const rash = req.params.rash;
        const data = req.body;
        await authService.changePassword(rash, data.password);
        res.render("resetPass", {data:null, action:"sucess", url: env.server.url});
    } catch (error) {
        res.status(403).render("resetPass", {data:null, action:"not-found", url: env.server.url});
    }
});