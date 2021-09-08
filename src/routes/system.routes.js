import express from "express";
const router = express.Router();
import { status } from "../controllers/system.controller";

/**
 * GET - /system/healthcheck
 * */    
router.route("/healthcheck")
    .get(status);

export default router;