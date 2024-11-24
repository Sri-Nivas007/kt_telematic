import express from "express";
import {
    createAssetCategory,
    deleteAssetCategory,
    getAssetCategoryById,
    getAssetCategories,
    updateAssetCategory,
} from "../controllers/assetCategoryController.js";

const router = express.Router();

// Get all asset categories
router.get("/categories", getAssetCategories);

// Get a single asset category by ID
router.get("/categories/:id/edit", getAssetCategoryById);

router.get("/category/create", (req, res) => {
    res.render("newassetcategory"); // Render the form to create a new employee
});


// Create a new asset category
router.post("/categories", createAssetCategory);

// Update an asset category by ID
router.post("/categories/:id/update", updateAssetCategory);

// Delete an asset category by ID
router.delete("/categories/:id/delete", deleteAssetCategory);

export default router;
