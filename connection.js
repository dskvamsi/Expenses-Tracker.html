import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Check database connection
pool.getConnection()
    .then((connection) => {
        console.log("✅ Connected to MySQL");
        connection.release();
    })
    .catch((err) => {
        console.error("❌ MySQL Connection Failed:", err.message);
    });


// Show all tables
export async function showAllTables(req, res) {
    try {
        const [result] = await pool.query("SHOW TABLES");

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}


// Show all expense records
export async function showAllRows(req, res) {
    try {
        const [result] = await pool.query("SELECT * FROM expenses");

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}


// Add a new expense
export async function addExpense(req, res) {
    try {
        const { description, category, expense_date, amount } = req.body;

        if (!description || !category || !expense_date || amount == null) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        const [result] = await pool.query(
            `INSERT INTO expenses 
            (description, category, expense_date, amount)
            VALUES (?, ?, ?, ?)`,
            [description, category, expense_date, amount]
        );

        res.status(201).json({
            message: "Expense added successfully",
            expenseId: result.insertId
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}


// Update an expense
export async function updateExpense(req, res) {
    try {
        const { id } = req.params;
        const { description, category, expense_date, amount } = req.body;

        const [result] = await pool.query(
            `UPDATE expenses
             SET description = ?, 
                 category = ?, 
                 expense_date = ?, 
                 amount = ?
             WHERE id = ?`,
            [description, category, expense_date, amount, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}


// Delete an expense
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
            message: "Expense deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}


// Clear all expenses
export async function clearAllExpenses(req, res) {
    try {
        await pool.query("DELETE FROM expenses");

        res.status(200).json({
            message: "All expenses deleted successfully"
        });

    } catch (err) {
        console.error("❌ Error clearing expenses:", err.message);

        res.status(500).json({
            error: err.message
        });
    }
}


export default pool;