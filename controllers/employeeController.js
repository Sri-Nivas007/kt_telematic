// controllers/employeeController.js
import db from "../models/index.js"; // Import the db object
const { Employee } = db; // Extract the Employee model

// Get all employees
export const getAllEmployees = async (req, res) => {
    console.log("Fetching all employees...");
    try {
        const employees = await Employee.findAll({ raw: true });
        console.log("Employees:", employees);
        res.status(200).json({ data: employees });
    } catch (error) {
        console.log("Error fetching employees:", error);
        res.status(500).json({
            message: "Error fetching employees",
            error,
        });
    }
};

// Get a single employee by ID
export const getEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        console.log("employeeId", employeeId);

        // Fetch employee by ID
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        // Render editEmployee view with the employee data
        res.render("editEmployee", { employee });
    } catch (error) {
        console.error("Error fetching employee by ID:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Create a new employee
export const createEmployee = async (req, res) => {
    try {
        const { name, job_title, status } = req.body;
        const newEmployee = await Employee.create({ name, job_title, status });
        res.redirect("/employee"); // After creation, redirect to the employee list
    } catch (error) {
        res.status(500).json({ message: "Error creating employee", error });
    }
};

// Update an employee
export const updateEmployeePost = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { name, job_title, status } = req.body;

        // Find the employee by ID
        const employee = await Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).send("Employee not found");
        }

        // Update the employee details
        await employee.update({
            name,
            job_title,
            status: status === "true", // Convert "true"/"false" string to boolean
        });

        // Redirect back to the employee list
        res.redirect("/employee");
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        console.log("Employee ID to delete:", employeeId);

        const deleted = await Employee.destroy({ where: { id: employeeId } });

        if (deleted) {
            return res.status(200).send({
                success: true,
                message: "Employee deleted successfully",
            });
        }
        res.status(404).send({ error: "Employee not found" });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send({
            error: "An error occurred while deleting the employee",
        });
    }
};
