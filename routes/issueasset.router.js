// routes/employeeRoutes.js

import express from "express";
import { getIssuedAssets, Issueasset } from "../controllers/isseuassetcontroller.js";

const router = express.Router();

// Create a new employee
router.post("/issue-asset", Issueasset);

router.get("/issued/asset",getIssuedAssets)

export default router;
