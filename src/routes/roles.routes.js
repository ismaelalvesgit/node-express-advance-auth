import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { createRoleShema, updateRoleShema } from "../validations/roles";
import { findOne, find, create, update, active, disabled } from "../controllers/role.controller";
import authorization from "../middleware/authorizeMiddleware";

/**
 * Execute for all routes
 */
router.use(authorization());

/**
 * PUT - /role/active/:id
 * PUT - /role/disabled/:id
 */
router.put("/active/:id", active);
router.put("/disabled/:id", disabled);

/**
 * GET - /role/:id
 * PUT - /role/:id
 */
router.route("/:id")
    .get(findOne)
    .put(verify(updateRoleShema), update);

/**
 * GET - /role
 * POST - /role
 * */    
router.route("/")
    .get(find)
    .post(verify(createRoleShema), create);

export default router;