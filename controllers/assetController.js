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
                    as: "category", // Ensure the alias matches what you're using
                    attributes: ["id", "name"], // Only include 'id' and 'name' from the category
                },
            ],
        });

        // Fetching categories for the dropdown (optional)
        const categories = await db.AssetCategory.findAll();

        res.render("assets/index", {
            assets,
            categories,
        });
    } catch (error) {
        console.error("Error fetching assets:", error);
        res.status(500).send("Error fetching assets");
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
        const {
            serial_number,
            make,
            model,
            description,
            categoryId,
            status,
            branch,
            price, // Add price to destructured fields
        } = req.body;

        // Validation (basic checks)
        if (
            !serial_number ||
            !make ||
            !model ||
            !categoryId ||
            !branch ||
            !status ||
            price === undefined // Ensure price is provided
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Validate ENUM values for branch and status
        const validBranches = ["chennai", "coimbatore", "bangalore"];
        const validStatuses = ["Available", "Unavailable"];

        if (!validBranches.includes(branch)) {
            return res.status(400).json({ error: "Invalid branch value" });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        // Validate price (ensure it's a positive number)
        if (isNaN(price) || price < 0) {
            return res.status(400).json({ error: "Invalid price value" });
        }

        // Create the asset
        const newAsset = await Asset.create({
            serial_number,
            make,
            model,
            description,
            categoryId,
            status,
            branch,
            price, // Include price in the creation
        });

        // Redirect to the assets page or send a response
        res.redirect("/assets");
        // Alternatively, you can return the asset data if you're using JSON response
        // res.status(201).json({ asset: newAsset });
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

export const stockview = async (req, res) => {
    try {
        console.log("Fetching stock data...");

        // Fetch stock data, including asset price, stock count, and branch (as an ENUM)
        const stockData = await db.Asset.findAll({
            attributes: [
                "branch", // The branch is now an ENUM in the Asset table
                "status",
                [
                    db.sequelize.fn("COUNT", db.sequelize.col("id")),
                    "stockCount",
                ],
                [
                    db.sequelize.fn("SUM", db.sequelize.col("price")),
                    "totalValue",
                ], // SUM for total value
                [
                    db.sequelize.fn("AVG", db.sequelize.col("price")),
                    "averagePrice",
                ], // Ensure averagePrice is being calculated
            ],
            group: ["branch", "status"], // Group by branch and status
        });

        // Branch name mapping based on ENUM values
        const branchEnum = {
            chennai: "Chennai",
            coimbatore: "Coimbatore",
            bangalore: "Bangalore",
        };

        // Format the stock data by replacing the branch ENUM with branch name
        const formattedStockData = stockData.map((stock) => ({
            ...stock.dataValues,
            branchName: branchEnum[stock.branch] || "Unknown Branch", // Map ENUM value to branch name
            price: stock.totalValue || 0, // Use total value if price is undefined
            averagePrice: stock.averagePrice || 0, // Handle undefined average price gracefully
        }));

        // Send the response with stock data to the view
        res.json({
            stocks: formattedStockData,
        });
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
};

