import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { createScopeShema, updateScopeShema, roleScopeShema } from "../validations/scopes";
import { findOne, find, create, update, active, disabled, addRole, removeRole } from "../controllers/scope.controller";
import authorization from "../middleware/authorizeMiddleware";

/**
 * Execute for all routes
 */
router.use(authorization());

/**
 * PUT - /scope/role/:id
 * DELETE - /scope/role/:id
 */
router.route("/role/:id")
    .post(verify(roleScopeShema), addRole)
    .delete(verify(roleScopeShema), removeRole);

/**
 * PUT - /scope/active/:id
 * PUT - /scope/disabled/:id
 */
router.put("/active/:id", active);
router.put("/disabled/:id", disabled);

/**
 * GET - /scope/:id
 * PUT - /scope/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(updateScopeShema), update);


/**
 * GET - /scope
 * POST - /scope
 * */    
router.route("/")
    .get(find)
    .post(verify(createScopeShema), create);

export default router;