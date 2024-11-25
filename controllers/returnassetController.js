import db from "../models/index.js"; // Import the db object
const { Employee, Asset, IssueAsset } = db;

export const getIssuedAssets = async (req, res) => {
    try {
        const issuedAssets = await db.IssueAsset.findAll({
            where: { status: "Issued" },
            include: [
                {
                    model: db.Asset,
                    as: "asset",
                    attributes: ["serial_number", "model"],
                },
                { model: db.Employee, as: "employee", attributes: ["name"] },
            ],
        });

        res.status(200).json({ success: true, data: issuedAssets });
    } catch (error) {
        console.error("Error fetching issued assets:", error);
        res.status(500).json({ error: "Failed to fetch issued assets" });
    }
};

export const getIssuedAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        const issuedAsset = await db.IssueAsset.findOne({
            where: { id, status: "Issued" },
            include: [
                { model: db.Asset, as: "asset" },
                { model: db.Employee, as: "employee" },
            ],
        });

        if (!issuedAsset) {
            return res.status(404).json({ error: "Issued asset not found" });
        }

        res.status(200).json({ success: true, data: issuedAsset });
    } catch (error) {
        console.error("Error fetching issued asset details:", error);
        res.status(500).json({ error: "Failed to fetch issued asset details" });
    }
};
export const returnAsset = async (req, res) => {
    try {
        const { id, returnReason, remarks } = req.body;

        // Find the issued asset by id and check its status
        const issuedAsset = await db.IssueAsset.findOne({
            where: { id, status: "Issued" },
        });

        if (!issuedAsset) {
            return res
                .status(404)
                .json({ error: "Issued asset not found or already returned" });
        }

        // Create a new record in the ReturnedAsset table to track the return
        const returnedAsset = await db.ReturnAsset.create({
            asset_id: issuedAsset.asset_id, // Link to the issued asset
            employee_id: issuedAsset.employee_id, // Link to the employee
            return_date: new Date(), // Capture the return date
            return_reason: returnReason, // Return reason
            remarks, // Optional remarks
            status: "Returned", // Return status
        });

        // Optionally, you can update the asset's status to 'Available' in the Asset table if needed
        const asset = await db.Asset.findByPk(issuedAsset.asset_id);
        if (asset) {
            asset.status = "Available"; // Mark the asset as available after return
            await asset.save();
        }

        // Return a success response with the new returned asset record
        res.status(200).json({
            success: true,
            message: "Asset returned successfully",
            data: returnedAsset,
        });
    } catch (error) {
        console.error("Error returning asset:", error);
        res.status(500).json({ error: "Failed to return asset" });
    }
};

export const getReturnReasons = async (req, res) => {
    const returnReasons = ["Upgrade", "Repair", "Resignation", "Other"];
    res.status(200).json({ success: true, data: returnReasons });
};
export const getReturnedAssets = async (req, res) => {
    try {
        console.log(2323232323);
        const returnedAssets = await db.ReturnAsset.findAll({
            include: [
                {
                    model: db.Asset,
                    as: "asset",
                    attributes: ["serial_number", "model"],
                },
                { model: db.Employee, as: "employee", attributes: ["name"] },
            ],
        });

        res.status(200).json({ success: true, data: returnedAssets });
    } catch (error) {
        console.error("Error fetching returned assets:", error);
        res.status(500).json({ error: "Failed to fetch returned assets" });
    }
};
