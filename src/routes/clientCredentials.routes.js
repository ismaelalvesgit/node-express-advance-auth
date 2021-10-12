import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { clientCredentials } from "../validations/clientCredentials";
import { findOne, find, create, remove} from "../controllers/clientCredentials.controller";
import authorization from "../middleware/authorizeMiddleware";


/**
 * GET - /credentials/:id
 */  
router.route("/:id")
    .get(authorization("credentials-14bf8221"), findOne);
    

/**
 * POST - /credentials
 * GET - /credentials
 */    
router.route("/")
    .get(authorization("credentials-14bf8221"), find)    
    .post(authorization("credentials-f3c3a587"), verify(clientCredentials), create)
    .delete(authorization("credentials-37baabb2"), verify(clientCredentials), remove);

export default router;