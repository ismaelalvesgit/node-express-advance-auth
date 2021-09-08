import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { createUserShema, updateUserShema } from "../validations/user";
import { findOne, find, create, update, del } from "../controllers/user.controller";
import authorization from "../middleware/authorizeMiddleware";

/**
 * GET - /user/:id
 * PUT - /user/:id
 * DELETE - /user/:id
 */
router.route("/:id")
    .get(authorization(["admin-user-find"]), findOne)
    .put(authorization(["admin-user-edit"]), verify(updateUserShema), update)
    .delete(authorization(["admin-user-delete"]), del);

/**
 * GET - /user
 * POST - /user
 * PUT - /user
 * DELETE - /user
 * */    
router.route("/")
    .get(authorization(), find)
    .post(verify(createUserShema), create)
    .put(authorization(), verify(updateUserShema), update)
    .delete(authorization(), del);

export default router;