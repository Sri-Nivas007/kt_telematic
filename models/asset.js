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
            type: DataTypes.ENUM("Available", "Repair","In use","Scrap"), // Allowed values
            allowNull: false,
            defaultValue: "Available", // Default value (Optional)
        },
    });

    return Asset;
};
