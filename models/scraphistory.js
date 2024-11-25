const ScrapHistory = (sequelize, DataTypes) => {
    const ScrapHistory = sequelize.define(
        "ScrapHistory",
        {
            asset_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Assets",
                    key: "id",
                },
            },
            scrap_reason: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            scrapped_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "scrap_history",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    return ScrapHistory;
};

export default ScrapHistory;
