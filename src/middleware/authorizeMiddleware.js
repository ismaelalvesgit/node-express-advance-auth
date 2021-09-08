import jsonwebtoken from "jsonwebtoken";
import env from "../env";
import { Unauthorized,  ServiceUnavailable} from "../utils/erro";
import YAML from "yamljs";
import logger from "../logger";

export default function authorize(roles = []){
    return (req, res, next)=>{  
        if(req.headers.authorization !== undefined){
            const token = req.headers.authorization;
            try {
                const decode = jsonwebtoken.verify(token, env.security.secret);
                if(decode.isAdmin){
                    next();
                }else if(roles.length > 0){
                    const role = roles.find((e)=>{
                        if(decode.roles.includes(e)){
                            return e;
                        }
                    });

                    if(role){
                        next();
                    }else{
                        next(new Unauthorized({code: "required"}));
                    }

                }else{
                    const urlLocal = req.originalUrl;
                    const httpMethod = req.method;
                    const rolesRouter = YAML.load("./scripts/authz.yaml");
                   
                    const configRouter = rolesRouter.configs.find((e) =>{
                        const routes = e.paths.map((r) => {
                            if(r.endsWith("*")){
                                return {
                                    router: r.replace("*", ""),
                                    search: "end"
                                };
                            }
                            
                            return {
                                router: r.replace("*", ""),
                                search: "start"
                            };
                        });
                        const method = e.methods;
                        if(method.includes(httpMethod)){
                            let match;
                            routes.forEach(element => {
                                if(element.search === "start"){
                                    if(urlLocal.endsWith(element.router)){
                                        match = e;
                                    }
                                }else{
                                    if(urlLocal.startsWith(element.router)){
                                        match = e;
                                    }
                                }
                            });

                            if(match){
                                return match;
                            }
                        }
                    });
    
                    if(configRouter){
                        let check = false;
                        decode.roles.forEach(element => {
                            if(configRouter.roles.includes(element)){
                                check = true;
                                return false;
                            }
                        });
                        if(check){
                            Object.assign(req, {
                                user: {
                                    name: decode.name,
                                    email: decode.email
                                }
                            });
                            next();
                        }else{
                            next(new Unauthorized({code: "required"}));
                        }
                    }else{
                        next(new ServiceUnavailable({code: "router"}));
                    }
                }
            } catch (error) {
                logger.warn(`Erro authz uuid - ${req.id} - ERRO - ${error}`);
                next(new Unauthorized({code: "token.invalid"}));
            }
        }else{
            next(new Unauthorized({code: "token.required"}));
        }
    };
}