export default (sequelize, DataTypes) => {
    const Asset = sequelize.define("Asset", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        serial_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        make: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "AssetCategories",
                key: "id",
            },
        },
        status: {
            type: DataTypes.ENUM("Available", "Repair", "Issued", "Scrapped"),
            allowNull: false,
            defaultValue: "Available",
        },
        branch: {
            type: DataTypes.ENUM("chennai", "coimbatore", "bangalore"),
            allowNull: false,
        },
        price: {
            // Add the price field
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        },
    });

    

    return Asset;
};
