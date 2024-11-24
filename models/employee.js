// models/employee.js
export default (sequelize, DataTypes) => {
    const Employee = sequelize.define("Employee", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true, // Automatically increments for each new record
            primaryKey: true, // Defines this as the primary key
            allowNull: false, // Ensures this field cannot be null
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        job_title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });

    return Employee;
};
