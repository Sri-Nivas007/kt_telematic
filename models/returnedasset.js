'use strict';

const ReturnAsset = (sequelize, DataTypes) => {
  const ReturnAsset = sequelize.define(
      "ReturnAsset",
      {
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    return_reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Returned', 'Under Repair', 'Scrapped'),
      allowNull: false,
      defaultValue: 'Returned',
    },
  
  },
  {
      tableName: "ReturnAsset",
      underscored: true,
      timestamps: true,
  }
);



return ReturnAsset;
};

export default ReturnAsset;
