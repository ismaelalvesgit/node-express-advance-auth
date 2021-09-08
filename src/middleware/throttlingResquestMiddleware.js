import { ServiceUnavailable } from "../utils/erro";
import { RateLimiterMemory } from "rate-limiter-flexible";
import env from "../env";
const opts = {
    points: env.env === "test" ? 10000 : 10,
    duration: 20
};
const rateLimiter = new RateLimiterMemory(opts);
const excludeUrl = [
    "/",
    "/system/metrics",
    "/system/healthcheck",
];

export default function throttlingResquestMiddleware (req, res, next) {
    if(excludeUrl.includes(req.originalUrl) || req.originalUrl.startsWith("/static")){
        next();
    }else{
        rateLimiter.consume((req.ip))
        .then((rateLimiterRes)=>{
            const headers = {
                "Retry-After": rateLimiterRes.msBeforeNext / 1000,
                "X-RateLimit-Limit": opts.points,
                "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
                "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext)
            };
            res.set(headers);
            next();
        }).catch((rateLimiterRes)=>{
            const headers = {
                "Retry-After": rateLimiterRes.msBeforeNext / 1000,
                "X-RateLimit-Limit": opts.points,
                "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
                "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext)
            };
            res.set(headers);
            next(new ServiceUnavailable({code: "throttling"}));
        });
        
    }
}