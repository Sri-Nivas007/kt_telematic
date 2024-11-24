import db from "../models/index.js"; // Import the db object
const { AssetCategory } = db; // Extract the Employee model
// Adjust based on your actual model
// Get all asset categories
export const getAssetCategories = async (req, res) => {
    try {
        const categories = await db.AssetCategory.findAll(); // Replace with your model name
        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

// Get a single asset category by ID
export const getAssetCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await AssetCategory.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.render("assetcatedit", { category });
        // res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch category" });
    }
};

// Create a new asset category
export const createAssetCategory = async (req, res) => {
    console.log("reqsdds", req.body);
    try {
        const { name, description } = req.body;

        // Check if both name and description are provided
        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        if (!description) {
            return res
                .status(400)
                .json({ error: "Category description is required" });
        }

        // Create the new asset category with name and description
        const newCategory = await AssetCategory.create({ name, description });
        res.redirect("/assetsCategory");
      //  res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create category" });
    }
};

// Update an asset category by ID
export const updateAssetCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await AssetCategory.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.name = name || category.name;
        await category.save();
        res.redirect("/assetsCategory");
        //  res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update category" });
    }
};

// Delete an asset category by ID
export const deleteAssetCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await AssetCategory.findByPk(id);

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        await category.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete category" });
    }
};
