import db from "../models/index.js"; // Import the db object
const { Employee, Asset, IssueAsset } = db;

export const Issueasset = async (req, res) => {
    try {
        const { assetId, employeeId, issueDate, status } = req.body;
        console.log("req.body", req.body);

        // Validate input
        if (!assetId || !employeeId || !issueDate || !status) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the asset exists and is available
        const asset = await Asset.findOne({
            where: { id: assetId, status: "Available" },
        });
        if (!asset) {
            return res
                .status(404)
                .json({ error: "Asset not found or not available" });
        }

        // Check if the employee exists
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Create IssueStock record
        const issueStock = await IssueAsset.create({
            asset_id: assetId,
            employee_id: employeeId,
            issue_date: issueDate,
            return_date: status === "Returned" ? new Date() : null,
            status: status,
        });

        // Update asset status to "Issued"
        await asset.update({ status: "Issued" });
        res.render("/issueasset");
        // res.status(201).json({ success: true, issueStock });
    } catch (error) {
        console.error("Error issuing asset:", error);
        res.status(500).json({ error: "Failed to issue asset" });
    }
};

export const getIssuedAssets = async (req, res) => {
    try {
        // Fetch issued assets along with related employee and asset details
        const issuedAssets = await IssueAsset.findAll({
            include: [
                {
                    model: Asset,
                    as: "asset",
                    attributes: ["id", "serial_number", "model", "status"],
                },
                {
                    model: Employee,
                    as: "employee",
                    attributes: ["id", "name"],
                },
            ],
            attributes: ["id", "issue_date", "return_date", "status"],
        });

        res.status(200).json({ success: true, data: issuedAssets });
    } catch (error) {
        console.error("Error fetching issued assets:", error);
        res.status(500).json({ error: "Failed to fetch issued assets" });
    }
};
