import express from "express";
const router = express.Router();
import verify from "../middleware/verifiyMiddleware";
import { loginShema, resetPassShema, changePassShema } from "../validations/auth";
import { login, resetPassword, checkLink, changePassword } from "../controllers/auth.controller";

/**
 * GET - /auth/changePassword/:rash
 * POST - /auth/changePassword/:rash
 */
router.route("/changePassword/:rash")
    .get(checkLink)
    .post(verify(changePassShema), changePassword);


/**
 * POST - /auth/resetPassword
 */    
router.post("/resetPassword", verify(resetPassShema), resetPassword);

/**
 * POST - /auth/login
 */    
router.post("/login", verify(loginShema), login);


export default router;