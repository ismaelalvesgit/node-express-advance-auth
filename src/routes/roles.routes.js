import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { createRoleShema, updateRoleShema } from "../validations/roles";
import { findOne, find, create, update, active, disabled } from "../controllers/role.controller";
import authorization from "../middleware/authorizeMiddleware";


/**
 * PUT - /role/active/:id
 * PUT - /role/disabled/:id
 */
router.put("/active/:id", authorization("role-55a2c468"), active);
router.put("/disabled/:id", authorization("role-13d81f99"), disabled);

/**
 * GET - /role/:id
 * PUT - /role/:id
 */
router.route("/:id")
    .get(authorization("role-ceb679f8"), findOne)
    .put(authorization("role-75d4364a"), verify(updateRoleShema), update);

/**
 * GET - /role
 * POST - /role
 * */    
router.route("/")
    .get(authorization("role-ceb679f8"), find)
    .post(authorization("role-f3c3a587"), verify(createRoleShema), create);

export default router;