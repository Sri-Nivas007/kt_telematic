// routes/employeeRoutes.js

import express from "express";
import { getIssuedAssetById, getIssuedAssets, getReturnedAssets, getReturnReasons, returnAsset } from "../controllers/returnassetController.js";

const router = express.Router();

// Create a new employee
router.get("/issued-assets",getIssuedAssets);

router.get("/issued-asset/:id",getIssuedAssetById)

router.post("/return-asset",returnAsset)

router.get("/return-reasons",getReturnReasons)

router.get ("/returned-assets",getReturnedAssets)

export default router;
