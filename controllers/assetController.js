import db from "../models/index.js"; // Import the db object
const { Asset } = db; // Extract the Employee model
// Adjust based on your actual model

// Get all assets with optional filters
// In your controller:

export const getAssets = async (req, res) => {
    try {
        const assets = await db.Asset.findAll({
            include: [
                {
                    model: db.AssetCategory,
                    as: 'category', // Ensure the alias matches what you're using
                    attributes: ['id', 'name'], // Only include 'id' and 'name' from the category
                },
            ],
        });

        // Fetching categories for the dropdown (optional)
        const categories = await db.AssetCategory.findAll();

        res.render('assets/index', {
            assets,
            categories,
        });
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).send('Error fetching assets');
    }
};

// Get a single asset by ID
export const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id123", id);
        const asset = await Asset.findByPk(id);
        console.log("asset123", asset);

        if (!asset) {
            return res.status(404).json({ error: "Asset not found" });
        }
        res.render("assetedit", { asset });
        // res.status(200).json({ asset });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fffffetch asset" });
    }
};

// Create a new asset
export const createAsset = async (req, res) => {
    console.log("req", req.body);
    try {
        const { serial_number, make, model, description, categoryId, status } =
            req.body;

        // Validation (basic checks)
        if (!serial_number || !make || !model || !categoryId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create the asset
        const newAsset = await Asset.create({
            serial_number,
            make,
            model,
            description,
            categoryId, // Include categoryId
            status,
        });
        res.redirect("/assets");
        //   res.status(201).json({ asset: newAsset });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create asset" });
    }
};

// Update an asset by ID
export const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
        const { serial_number, make, model, description } = req.body;

        const asset = await Asset.findByPk(id);

        if (!asset) {
            return res.status(404).json({ error: "Asset not found" });
        }

        // Update the asset
        asset.serial_number = serial_number || asset.serial_number;

        asset.make = make || asset.make;
        asset.model = model || asset.model;
        asset.description = description || asset.description;

        await asset.save();

        res.status(200).json({ asset });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update asset" });
    }
};

// Delete an asset by ID
export const deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const asset = await Asset.findByPk(id);

        if (!asset) {
            return res.status(404).json({ error: "Asset not found" });
        }

        await asset.destroy();

        res.status(200).json({ message: "Asset deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete asset" });
    }
};
