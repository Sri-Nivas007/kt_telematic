import express from "express";
import {
    createAsset,
    deleteAsset,
    getAssetById,
    getAssets,
    stockview,
    updateAsset,
} from "../controllers/assetController.js";

const router = express.Router();

router.get("/asset", getAssets);

// Get a single asset by ID
router.get("/asset/:id/edit", getAssetById);

router.get("/asset/create", (req, res) => {
    res.render("newAsset"); // Render the form to create a new employee
});

// Create a new asset
router.post("/asset", createAsset);

// Update an asset by ID
router.put("/asset/:id/update", updateAsset);

// Delete an asset by ID
router.delete("/asset/:id/delete", deleteAsset);

router.get("/stockviews", stockview);

export default router;
