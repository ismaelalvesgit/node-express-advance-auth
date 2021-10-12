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
    .get(authorization("user-e4d47e1d"), findOne)
    .put(authorization("user-fa651125"), verify(updateUserShema), update)
    .delete(authorization("user-e8d40e62"), del);

/**
 * GET - /user
 * POST - /user
 * PUT - /user
 * DELETE - /user
 * */    
router.route("/")
    .get(authorization("user-e4d47e1d"), find)
    .post(authorization("user-2c0c66f3"), verify(createUserShema), create)
    .put(authorization("user-fa651125"), verify(updateUserShema), update)
    .delete(authorization("user-e8d40e62"), del);

export default router;