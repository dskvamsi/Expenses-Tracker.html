import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();


// ==========================================
// MySQL Connection Pool
// ==========================================

const pool = mysql.createPool({

    host:
        process.env.MYSQLHOST ||
        process.env.DB_HOST,

    user:
        process.env.MYSQLUSER ||
        process.env.DB_USER,

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
// Show Logged-In User Expenses
// ==========================================

export async function showAllRows(req, res) {

    try {

        const userId = req.user.id;

        const [result] = await pool.query(

            `SELECT *
             FROM expenses
             WHERE user_id = ?
             ORDER BY created_at DESC, id DESC`,

            [userId]

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

        const userId = req.user.id;

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


        // created_at is generated automatically
        // by MySQL DEFAULT CURRENT_TIMESTAMP
        const [result] = await pool.query(

            `INSERT INTO expenses
            (
                user_id,
                description,
                category,
                expense_date,
                amount
            )
            VALUES (?, ?, ?, ?, ?)`,

            [
                userId,
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

        const userId = req.user.id;

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

             WHERE id = ?
             AND user_id = ?`,

            [
                description,
                category,
                expense_date,
                amount,
                id,
                userId
            ]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Expense not found."
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

        const userId = req.user.id;


        const [result] = await pool.query(

            `DELETE FROM expenses
             WHERE id = ?
             AND user_id = ?`,

            [
                id,
                userId
            ]

        );


        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Expense not found."
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
// Clear Logged-In User Expenses
// ==========================================

export async function clearAllExpenses(req, res) {

    try {

        const userId = req.user.id;


        await pool.query(

            `DELETE FROM expenses
             WHERE user_id = ?`,

            [userId]

        );


        res.status(200).json({
            message:
                "All your expenses deleted successfully"
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