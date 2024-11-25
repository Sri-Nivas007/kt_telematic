import Sequelize from "sequelize";
import dotenv from "dotenv";
import config from "../config/config.json" assert { type: "json" };

// Import models
import EmployeeModel from "./employee.js";
import AssetModel from "./asset.js";
import AssetCategoryModel from "./assetcategory.js";
import IssueAssetModel from "./issuestock.js";

import ReturnAssetModel from "./returnedasset.js"

import ScrapAssetModel from "./scraphistory.js"

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
    IssueAsset: IssueAssetModel(sequelize, Sequelize.DataTypes),
    ReturnAsset: ReturnAssetModel(sequelize, Sequelize.DataTypes),
   ScrapAsset: ScrapAssetModel(sequelize, Sequelize.DataTypes),
};

// Define associations
// Asset and AssetCategory association
db.Asset.belongsTo(db.AssetCategory, {
    foreignKey: "categoryId",
    as: "category",
}); // Alias 'category'
db.AssetCategory.hasMany(db.Asset, { foreignKey: "categoryId", as: "assets" });

// IssueAsset associations
db.IssueAsset.belongsTo(db.Asset, {
    foreignKey: "asset_id",
    as: "asset", // Alias for Asset association
});
db.IssueAsset.belongsTo(db.Employee, {
    foreignKey: "employee_id",
    as: "employee", // Alias for Employee association
});

// Asset and IssueAsset association
db.Asset.hasMany(db.IssueAsset, {
    foreignKey: "asset_id",
    as: "issuedStocks", // Alias for IssueStock association
});

// Employee and IssueAsset association
db.Employee.hasMany(db.IssueAsset, {
    foreignKey: "employee_id",
    as: "issuedAssets", // Alias for IssueAsset association
});

// ReturnAsset associations
db.ReturnAsset.belongsTo(db.Asset, {
    foreignKey: "asset_id",
    as: "asset", // Alias for Asset association
});
db.ReturnAsset.belongsTo(db.Employee, {
    foreignKey: "employee_id",
    as: "employee", // Alias for Employee association
});

// Asset and ReturnAsset association
db.Asset.hasMany(db.ReturnAsset, {
    foreignKey: "asset_id",
    as: "returnedAssets", // Alias for ReturnAsset association
});

// Employee and ReturnAsset association
db.Employee.hasMany(db.ReturnAsset, {
    foreignKey: "employee_id",
    as: "returnedAssets", // Alias for ReturnAsset association
});

// ScrapAsset associations
db.ScrapAsset.belongsTo(db.Asset, {
    foreignKey: "asset_id",
    as: "asset", // Alias for Asset association
});


// Asset and ScrapAsset association (One-to-many)
db.Asset.hasMany(db.ScrapAsset, {
    foreignKey: "asset_id",
    as: "scrapHistory", // Alias for ScrapAsset association
});

//db.Asset.hasMany(db.IssueAsset, { as: 'issuedStocks' });
db.IssueAsset.belongsTo(db.Asset, { foreignKey: 'assetId', as: 'issuedStocks' }); // Alias here must match
 // Alias defined as 'issuedStocks'

// Employee and ScrapAsset association (One-to-many)



// Sync database (Optional: Only for development purposes)
//sequelize.sync({ alter: true });

// Export database object
export default db;
