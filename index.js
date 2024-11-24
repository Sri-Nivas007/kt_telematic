import express from "express";
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import Employeerouter from "./routes/employee.router.js";
import Assetrouter from "./routes/asset.router.js";
import Assetcategory from "./routes/assetCategory.js";
import db from "./models/index.js"; // Import the default export

const __dirname = path.resolve();

const app = express();

// Set up Pug as the view engine
app.set("view engine", "pug"); // Set the view engine to Pug
app.set("views", path.join(__dirname, "views")); // Path to views directory
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (e.g., images, js)
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

// Sequelize sync to create tables
db.sequelize.sync({ force: false }).then(() => {
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
        // Fetch assets with associated categories
        const assets = await db.Asset.findAll({
            include: [
                {
                    model: db.AssetCategory,
                    as: 'category',  // This should match the alias you define in your model
                    attributes: ['name'],  // Only include 'name' of the category
                },
            ],
        });

        const categories = await db.AssetCategory.findAll(); // Fetch categories for filtering purposes
        
        // Render the assets page, passing the assets and categories to the view
        res.render("asset", { categories, assets });
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
