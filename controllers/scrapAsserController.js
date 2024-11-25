import db from "../models/index.js"; // Import the db object
const { Asset, ScrapAsset } = db;
// Fetch all active assets
export const getActiveAssets = async (req, res) => {
    console.log("heheeeh2222");
    try {
        const activeAssets = await Asset.findAll({
            where: { status: "Available" },
        });
        res.json({ success: true, data: activeAssets });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch active assets.",
        });
    }
};

// Fetch all scrapped assets
export const getScrappedAssets = async (req, res) => {
    try {
        const scrappedAssets = await Asset.findAll({
            where: { status: "Scrapped" },
        });
        res.json({ success: true, data: scrappedAssets });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch scrapped assets.",
        });
    }
};

// Mark an asset as scrapped
export const scrapAsset = async (req, res) => {
    console.log("req", req);
    const { assetId, scrapReason } = req.body; // Assuming createdBy is the employee who is scrapping the asset
    console.log("scrapReason", scrapReason);
    console.log("assetId", assetId);

    try {
        const asset = await Asset.findByPk(assetId);
        if (!asset) {
            return res
                .status(404)
                .json({ success: false, error: "Asset not found." });
        }

        // 1. Update the Asset table
        asset.status = "Scrapped";
        asset.scrap_reason = scrapReason; // Assuming scrap_reason column exists
        await asset.save();

        // 2. Insert a record in the ScrapAsset table
        await ScrapAsset.create({
            asset_id: assetId, // Link to the Asset

            scrap_reason: scrapReason, // Reason for scrapping
            scrap_date: new Date(), // Date when the asset was scrapped
        });

        res.json({
            success: true,
            message: "Asset marked as scrapped and recorded in scrap history.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to scrap the asset and update scrap history.",
        });
    }
};

export const getAssetHistory = async (req, res) => {
    console.log(12311313);
    const assetId = req.params.assetId; // Get assetId from route parameter
    console.log("assetId", assetId);

    if (!assetId) {
        return res.status(400).json({ error: "Asset ID is required" });
    }

    try {
        // Fetch the asset along with its history (issue, return, and scrap data)
        const asset = await Asset.findOne({
            where: { id: assetId },
            include: [
                {
                    model: db.ScrapAsset,
                    as: "scrapHistory",  // Alias to include scrap details
                    attributes: ["scrap_reason", "scrapped_at"],
                    order: [["scrapped_at", "DESC"]], // Get the latest scrap first
                },
                {
                    model: db.IssueAsset,  // Assuming IssueStocks model is set up
                    as: "issuedStocks",     // Alias for IssueStocks table
                    attributes: ["employee_id", "issue_date"], // Include employee and issue date
                    order: [["issue_date", "DESC"]], // Get the latest issue date first
                },
                {
                    model: db.ReturnAsset,  // Assuming ReturnAsset model is set up
                    as: "returnedAssets",    // Alias for ReturnAsset table
                    attributes: ["employee_id", "return_date"], // Include employee and return date
                    order: [["return_date", "DESC"]], // Get the latest return date first
                },
            ],
            raw: true, // Raw query to get plain objects instead of Sequelize model instances
        });

        console.log('Asset:', asset);

        if (!asset) {
            return res
                .status(404)
                .json({ error: "No asset found with the given ID" });
        }

        // Return asset details along with the issue, return, and scrap information
        return res.json({
            serial_number: asset.serial_number,
            model: asset.model,
            status: asset.status,
            scraps: asset.scrapHistory,  // Scrap details
            issues: asset.issueHistory,  // Issue details
            returns: asset.returnHistory, // Return details
        });
    } catch (error) {
        console.error("Error fetching asset history:", error);
        return res.status(500).json({ error: "Failed to fetch asset history" });
    }
};

