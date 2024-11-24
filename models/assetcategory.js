// models/assetCategory.js
export default (sequelize, DataTypes) => {
    const AssetCategory = sequelize.define("AssetCategory", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensures each category name is unique
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true, // Optional description for the category
        },
    });

    // Define associations, if necessary
    // This allows AssetCategory to have many assets (one-to-many relationship)
    AssetCategory.hasMany(sequelize.models.Asset, { foreignKey: "categoryId" });

    return AssetCategory;
};
