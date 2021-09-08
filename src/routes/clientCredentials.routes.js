import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { clientCredentials } from "../validations/clientCredentials";
import { findOne, find, create, remove} from "../controllers/clientCredentials.controller";
import authorization from "../middleware/authorizeMiddleware";

/**
 * Execute for all routes
 */
router.use(authorization());

/**
 * GET - /credentials/:id
 */  
router.route("/:id")
    .get(findOne);
    

/**
 * POST - /credentials
 * GET - /credentials
 */    
router.route("/")
    .get(find)    
    .post(verify(clientCredentials), create)
    .delete(verify(clientCredentials), remove);

export default router;