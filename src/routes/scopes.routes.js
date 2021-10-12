import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { createScopeShema, updateScopeShema, roleScopeShema } from "../validations/scopes";
import { findOne, find, create, update, active, disabled, addRole, removeRole } from "../controllers/scope.controller";
import authorization from "../middleware/authorizeMiddleware";


/**
 * PUT - /scope/role/:id
 * DELETE - /scope/role/:id
 */
router.route("/role/:id")
    .post(authorization("scope-81c3567e"), verify(roleScopeShema), addRole)
    .delete(authorization("scope-05152b08"), verify(roleScopeShema), removeRole);

/**
 * PUT - /scope/active/:id
 * PUT - /scope/disabled/:id
 */
router.put("/active/:id", authorization("scope-327c6e70"), active);
router.put("/disabled/:id", authorization("scope-1155af41"), disabled);

/**
 * GET - /scope/:id
 * PUT - /scope/:id
 */
router.route("/:id")
    .get(authorization("scope-271f6cc8"), findOne)
    .put(authorization("scope-5011d1c0"), verify(updateScopeShema), update);


/**
 * GET - /scope
 * POST - /scope
 * */    
router.route("/")
    .get(authorization("scope-271f6cc8"), find)
    .post(authorization("scope-c3ed91ba"), verify(createScopeShema), create);

export default router;