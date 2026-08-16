import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


// ==========================================
// MySQL Connection Pool
// ==========================================

const pool = mysql.createPool({

    // Railway variables first
    // Local .env variables used as fallback
    host: process.env.MYSQLHOST || process.env.DB_HOST,

    user: process.env.MYSQLUSER || process.env.DB_USER,

    password:
        process.env.MYSQLPASSWORD ||
        process.env.DB_PASSWORD,

    database:
        process.env.MYSQLDATABASE ||
        process.env.DB_NAME,

    port: Number(
        process.env.MYSQLPORT ||
        process.env.DB_PORT ||
        3306
    ),

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// ==========================================
// Check Database Connection
// ==========================================

pool.getConnection()
    .then((connection) => {

        console.log("✅ Connected to MySQL");

        connection.release();

    })
    .catch((err) => {

        console.error(
            "❌ MySQL Connection Failed:",
            err.message
        );

    });


// ==========================================
// Show All Tables
// ==========================================

export async function showAllTables(req, res) {

    try {

        const [result] =
            await pool.query("SHOW TABLES");

        res.status(200).json(result);

    } catch (err) {

        console.error(
            "❌ Error fetching tables:",
            err.message
        );

        res.status(500).json({
            error: err.message
        });

    }
}


// ==========================================
// Show All Expenses
// ==========================================

export async function showAllRows(req, res) {

    try {

        const [result] = await pool.query(
            `SELECT *
             FROM expenses
             ORDER BY created_at DESC`
        );

        res.status(200).json(result);

    } catch (err) {

        console.error(
            "❌ Error fetching expenses:",
            err.message
        );

        res.status(500).json({
            error: err.message
        });

    }
}


// ==========================================
// Add Expense
// ==========================================

export async function addExpense(req, res) {

    try {

        const {
            description,
            category,
            expense_date,
            amount
        } = req.body;


        // Validate input
        if (
            !description ||
            !category ||
            !expense_date ||
            amount == null ||
            Number(amount) <= 0
        ) {

            return res.status(400).json({
                message: "All fields are required."
            });

        }


        const [result] = await pool.query(

            `INSERT INTO expenses
            (
                description,
                category,
                expense_date,
                amount
            )
            VALUES (?, ?, ?, ?)`,

            [
                description,
                category,
                expense_date,
                amount
            ]

        );


        res.status(201).json({

            message:
                "Expense added successfully",

            expenseId:
                result.insertId

        });


    } catch (err) {

        console.error(
            "❌ Error adding expense:",
            err.message
        );

        res.status(500).json({
            error: err.message
        });

    }
}


// ==========================================
// Update Expense
// ==========================================

export async function updateExpense(req, res) {

    try {

        const { id } = req.params;

        const {
            description,
            category,
            expense_date,
            amount
        } = req.body;


        if (
            !description ||
            !category ||
            !expense_date ||
            amount == null ||
            Number(amount) <= 0
        ) {

            return res.status(400).json({
                message: "All fields are required."
            });

        }


        const [result] = await pool.query(

            `UPDATE expenses

             SET description = ?,
                 category = ?,
                 expense_date = ?,
                 amount = ?

             WHERE id = ?`,

            [
                description,
                category,
                expense_date,
                amount,
                id
            ]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }


        res.status(200).json({
            message:
                "Expense updated successfully"
        });


    } catch (err) {

        console.error(
            "❌ Error updating expense:",
            err.message
        );

        res.status(500).json({
            error: err.message
        });

    }
}


// ==========================================
// Delete Expense
// ==========================================

export async function deleteExpense(req, res) {

    try {

        const { id } = req.params;


        const [result] = await pool.query(

            "DELETE FROM expenses WHERE id = ?",

            [id]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Expense not found"
            });

        }


        res.status(200).json({
            message:
                "Expense deleted successfully"
        });


    } catch (err) {

        console.error(
            "❌ Error deleting expense:",
            err.message
        );

        res.status(500).json({
            error: err.message
        });

    }
}


// ==========================================
// Clear All Expenses
// ==========================================

export async function clearAllExpenses(req, res) {

    try {

        await pool.query(
            "DELETE FROM expenses"
        );


        res.status(200).json({
            message:
                "All expenses deleted successfully"
        });


    } catch (err) {

        console.error(
            "❌ Error clearing expenses:",
            err.message
        );


        res.status(500).json({
            error: err.message
        });

    }
}


// ==========================================
// Export Pool
// ==========================================

export default pool;