import jsonwebtoken from "jsonwebtoken";
import env from "../env";
import { Unauthorized,  ServiceUnavailable} from "../utils/erro";
import YAML from "yamljs";
import logger from "../logger";

export default function authorize(Sid){
    return (req, res, next)=>{  
        const { configs } = YAML.load("./scripts/authz.yaml");
        const configRouter = configs.find((e) => e.Sid === Sid);
        if(!configRouter){
            next(new ServiceUnavailable({code: "router"}));
        }
        if(configRouter.optional){
            return next();
        }
        if(req.headers.authorization !== undefined){
            const token = req.headers.authorization;
            try {
                const decode = jsonwebtoken.verify(token, env.security.secret);
                const { roles } = configRouter;
                if(decode.isAdmin){
                    next();
                }else if(roles.length > 0){
                    const role = roles.find((e)=>{
                        if(decode.roles.includes(e)){
                            return e;
                        }
                    });
                    if(role){
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
            } catch (error) {
                logger.warn(`Erro authz uuid - ${req.id} - ERRO - ${error}`);
                next(new Unauthorized({code: "token.invalid"}));
            }
        }else{
            next(new Unauthorized({code: "token.required"}));
        }
    };
}