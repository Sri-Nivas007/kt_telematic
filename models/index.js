import Sequelize from "sequelize";
import dotenv from "dotenv";
import config from "../config/config.json" assert { type: "json" };

// Import models
import EmployeeModel from "./employee.js";
import AssetModel from "./asset.js";
import AssetCategoryModel from "./assetcategory.js";

dotenv.config();

// Initialize Sequelize with configuration
const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host: config.development.host,
        dialect: "postgres", // Adjust dialect if using a different DB
    }
);

// Define models
const db = {
    sequelize,
    Sequelize,
    Employee: EmployeeModel(sequelize, Sequelize.DataTypes),
    Asset: AssetModel(sequelize, Sequelize.DataTypes),
    AssetCategory: AssetCategoryModel(sequelize, Sequelize.DataTypes),
};

// Define associations
// Define associations
db.Asset.belongsTo(db.AssetCategory, { foreignKey: 'categoryId', as: 'category' }); // Alias 'category'
db.AssetCategory.hasMany(db.Asset, { foreignKey: 'categoryId', as: 'assets' });


// Export database object
export default db;
