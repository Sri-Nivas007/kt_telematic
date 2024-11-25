

const IssueStock = (sequelize, DataTypes) => {
    const IssueStock = sequelize.define(
        "IssueStock",
        {
            id: {
                // Adding an id column as the primary key
                type: DataTypes.INTEGER,
                primaryKey: true, // Mark this column as the primary key
                autoIncrement: true, // Automatically increment the id value
                allowNull: false,
            },
            asset_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            employee_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            issue_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            return_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Issued",
            },
        },
        {
            tableName: "IssueStocks",
            underscored: true,
            timestamps: true,
        }
    );

   

    return IssueStock;
};

export default IssueStock;
