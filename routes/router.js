import { Router } from "express";

import {
    showAllTables,
    showAllRows,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllExpenses
} from "../connection.js";

import { authenticateUser } from "../middleware/authMiddleware.js";


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

expenseRouter.get(
    "/tables",
    authenticateUser,
    showAllTables
);


// -------------------------
// Get all expenses
// -------------------------

expenseRouter.get(
    "/allrows",
    authenticateUser,
    showAllRows
);


// -------------------------
// Add new expense
// -------------------------

expenseRouter.post(
    "/",
    authenticateUser,
    addExpense
);


// -------------------------
// Update expense
// -------------------------

expenseRouter.put(
    "/:id",
    authenticateUser,
    updateExpense
);


// -------------------------
// Clear all expenses
// -------------------------

expenseRouter.delete(
    "/clear",
    authenticateUser,
    clearAllExpenses
);


// -------------------------
// Delete single expense
// -------------------------

expenseRouter.delete(
    "/:id",
    authenticateUser,
    deleteExpense
);


export default expenseRouter;