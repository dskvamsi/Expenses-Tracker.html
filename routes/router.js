import { Router } from "express";

import {
    showAllTables,
    showAllRows,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllExpenses
} from "../connection.js";


const expenseRouter = Router();


// -------------------------
// Test Route
// -------------------------
expenseRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Expense Tracker API is running 🚀"
    });
});


// -------------------------
// Get all database tables
// -------------------------
expenseRouter.get("/tables", showAllTables);


// -------------------------
// Get all expenses
// -------------------------
expenseRouter.get("/allrows", showAllRows);


// -------------------------
// Add new expense
// -------------------------
expenseRouter.post("/", addExpense);


// -------------------------
// Update expense
// -------------------------
expenseRouter.put("/:id", updateExpense);


// -------------------------
// Clear all expenses
// -------------------------
expenseRouter.delete("/clear", clearAllExpenses);


// -------------------------
// Delete single expense
// -------------------------
expenseRouter.delete("/:id", deleteExpense);


export default expenseRouter;