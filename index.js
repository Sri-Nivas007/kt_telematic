import express from "express";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Employeerouter from "./routes/employee.router.js";
import Assetrouter from "./routes/asset.router.js";
import Assetcategory from "./routes/assetCategory.js";

import Issueasset from "./routes/issueasset.router.js";

import Returnasset from "./routes/returnasset.router.js";

import scrapAsset from "./routes/scrapAsser.router.js";

import db from "./models/index.js"; // Import the default export

const __dirname = path.resolve();

const app = express();

// Set up Pug as the view engine
app.set("view engine", "pug"); // Set the view engine to Pug
app.set("views", path.join(__dirname, "views")); // Path to views directory
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (e.g., images, js)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

dotenv.config();

// Sequelize sync to create tables
db.sequelize.sync({ force: false, alter: false }).then(() => {
    // Use db.sequelize
    // console.log("Views directory:", path.join(__dirname, "views"));
    //  console.log("Database synced!");
    app.listen(3000, () => {
        console.log("Server started on http://localhost:3000");
    });
});
app.use("/", Employeerouter);
app.use("/", Assetrouter);
app.use("/", Assetcategory);
app.use("/", Issueasset);
app.use("/", Returnasset);
app.use("/", scrapAsset);

// Route to render the index view
app.get("/", (req, res) => {
    res.render("index"); // This will render the index.pug template
});

app.get("/employee", async (req, res) => {
    try {
        const employees = await db.Employee.findAll({ raw: true }); // Fetch employees
        res.render("employee-list", { employees }); // Pass employees data to the view
    } catch (error) {
        console.log("Error fetching employees:", error);
        res.status(500).send("Error fetching employees");
    }
});

app.get("/assets", async (req, res) => {
    try {
        const categories = await db.AssetCategory.findAll(); // Fetch categories from the database
        const assets = await db.Asset.findAll(); // Fetch assets from the database
        res.render("asset", { categories, assets }); // Pass data to Pug template
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/assetsCategory", async (req, res) => {
    try {
        const assetsCategory = await db.AssetCategory.findAll({ raw: true });
        console.log("assetsCategory", assetsCategory);
        res.render("assetCategory", { categories: assetsCategory }); // Pass as `categories`
    } catch (error) {
        console.log("Error fetching asset categories:", error);
        res.status(500).send("Error fetching asset categories");
    }
});
app.get("/stock-view", async (req, res) => {
    try {
        console.log("hello");
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
                ],
            ],
            group: ["branch", "status"], // Group by branch and status
        });

        // Branch name mapping based on ENUM values
        const branchEnum = {
            chennai: "Chennai",
            coimbatore: "Coimbatore",
            bangalore: "Bangalore",
        };
        console.log("stockDatasdsds", stockData);
        // Format the stock data by replacing the branch ENUM with branch name
        const formattedStockData = stockData.map((stock) => ({
            ...stock.dataValues,
            branchName: branchEnum[stock.branch] || "Unknown Branch", // Map ENUM value to branch name
        }));
        console.log("formattedStockData", formattedStockData);
        // Send the response with stock data to the view
        res.render("stockview", {
            stocks: formattedStockData, // Pass formatted stock data to the template
        });
    } catch (error) {
        console.error("Error fetching stock data:", error);
        res.status(500).json({ error: "Failed to fetch stock data" });
    }
});

app.get("/issue-asset", async (req, res) => {
    try {
        const assets = await db.Asset.findAll({
            where: { status: "Available" },
        });
        const employees = await db.Employee.findAll();
        res.render("issueasset", { assets: assets, employees: employees });
    } catch (error) {
        console.error("Error fetching data for issue-asset page:", error);
        res.status(500).json({ error: "Failed to load issue-asset page" });
    }
});

app.get("/return-asset", async (req, res) => {
    try {
        const issuedAssets = await db.IssueAsset.findAll({
            where: { status: "Issued" },
            include: [
                { model: db.Asset, as: "asset" },
                { model: db.Employee, as: "employee" },
            ],
        });

        const returnedAssets = await db.IssueAsset.findAll({
            where: { status: "Returned" },
            include: [
                { model: db.Asset, as: "asset" },
                { model: db.Employee, as: "employee" },
            ],
        });

        const returnReasons = ["Upgrade", "Repair", "Resignation", "Other"];

        res.render("returnasset", {
            issuedAssets,
            returnReasons,
            returnedAssets,
        });
    } catch (error) {
        console.error("Error rendering return asset page:", error);
        res.status(500).send("Failed to load page");
    }
});

app.get("/scrap-asset", async (req, res) => {
    try {
        // Fetch active assets to populate the dropdown
        const activeAssets = await db.Asset.findAll({
            where: { status: "Available" },
            attributes: ["id", "serial_number", "model", "status"],
            raw: true, // Ensure you fetch relevant fields
        });

        // Fetch scrapped assets to display in the scrapped assets table
        const scrappedAssets = await db.Asset.findAll({
            where: { status: "Scrapped" },
            attributes: ["serial_number", "model"], // Fields for scrapped assets table
        });
        console.log("activeAssets", activeAssets);
        console.log("scrappedAssets", scrappedAssets);
        res.render("scrapasset", {
            activeAssets: activeAssets, // Pass active assets for the dropdown
            scrappedAssets: scrappedAssets, // Pass scrapped assets for the table
        });
    } catch (error) {
        console.error("Error fetching assets for scrap:", error);
        res.status(500).json({ error: "Failed to load scrap asset page." });
    }
});

app.get("/asset-history", async (req, res) => {
    try {
        // Fetch all assets with their history (issue, return, and scrap data)
        const assets = await db.Asset.findAll({
            raw: true,
            include: [
                {
                    model: db.ScrapAsset,
                    as: "scrapHistory",
                    attributes: ["scrap_reason", "scrapped_at"],
                    order: [["scrapped_at", "DESC"]],
                },
                {
                    model: db.IssueAsset,
                    as: "issuedStocks", // Correct alias here
                    attributes: ["employee_id", "issue_date"],
                    order: [["issue_date", "DESC"]],
                    include: [
                        {
                            model: db.Employee,
                            as: "employee",
                            attributes: ["name"],
                        },
                    ],
                },
                {
                    model: db.ReturnAsset,
                    as: "returnedAssets",
                    attributes: ["employee_id", "return_date"],
                    order: [["return_date", "DESC"]],
                    include: [
                        {
                            model: db.Employee,
                            as: "employee",
                            attributes: ["name"],
                        },
                    ],
                },
            ],
        });

        console.log("assets", assets);

        // Render the asset history page and pass the assets
        res.render("assethistory", {
            assets: assets, // Pass the assets to the Pug template
        });
    } catch (error) {
        console.error("Error fetching assets:", error);
        res.status(500).json({ error: "Failed to fetch assets" });
    }
});
