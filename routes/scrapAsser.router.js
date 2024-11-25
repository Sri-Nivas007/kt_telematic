// routes/employeeRoutes.js

import express from "express";
import {
    getActiveAssets,
    getAssetHistory,
    getScrappedAssets,
    scrapAsset,
} from "../controllers/scrapAsserController.js";

const router = express.Router();

// Route to fetch all active assets
router.get("/active-assets", getActiveAssets);

// Route to fetch all scrapped assets (reports)
router.get("/scrapped-assets", getScrappedAssets);

// Route to mark an asset as scrapped
router.post("/scrap", scrapAsset);


router.get('/assets/:assetId/history',getAssetHistory);

export default router;
