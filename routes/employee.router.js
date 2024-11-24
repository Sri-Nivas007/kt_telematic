// routes/employeeRoutes.js

import express from "express";
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    deleteEmployee,
    updateEmployeePost,
} from "../controllers/employeeController.js";

const router = express.Router();

// Get all employees
router.get("/allemployees", getAllEmployees);

// Get the form for adding a new employee
router.get("/employees/create", (req, res) => {
    res.render("createEmployee"); // Render the form to create a new employee
});

// Get employee by ID
router.get("/employees/:id/edit", getEmployeeById);

// Create a new employee
router.post("/employees", createEmployee);

// Update an employee by ID
router.post("/employees/:id/update", updateEmployeePost);

// Delete an employee by ID
router.delete("/employees/:id/delete", deleteEmployee);

export default router;
