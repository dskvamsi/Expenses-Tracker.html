import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../connection.js";

const authRouter = Router();


// ==========================================
// REGISTER USER
// ==========================================

authRouter.post("/register", async (req, res) => {

    try {

        const { username, password } = req.body;


        // Basic validation
        if (!username || !password) {

            return res.status(400).json({
                message: "Username and password are required."
            });

        }


        if (username.length < 3) {

            return res.status(400).json({
                message: "Username must be at least 3 characters."
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters."
            });

        }


        // Check if username already exists
        const [existingUsers] = await pool.query(

            `SELECT id
             FROM users
             WHERE username = ?`,

            [username]

        );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                message: "Username already exists."
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Save user
        const [result] = await pool.query(

            `INSERT INTO users
            (
                username,
                password
            )
            VALUES (?, ?)`,

            [
                username,
                hashedPassword
            ]

        );


        return res.status(201).json({

            message:
                "Account created successfully.",

            userId:
                result.insertId

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        return res.status(500).json({
            message:
                "Unable to create account."
        });

    }

});


// ==========================================
// LOGIN USER
// ==========================================

authRouter.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;


        // Check required fields
        if (!username || !password) {

            return res.status(400).json({
                message:
                    "Username and password are required."
            });

        }


        // Find user
        const [users] = await pool.query(

            `SELECT
                id,
                username,
                password
             FROM users
             WHERE username = ?`,

            [username]

        );


        // Username not found
        if (users.length === 0) {

            return res.status(401).json({
                message:
                    "Invalid username or password."
            });

        }


        const user = users[0];


        // Compare entered password
        // with stored bcrypt hash
        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password
            );


        // Wrong password
        if (!passwordMatches) {

            return res.status(401).json({
                message:
                    "Invalid username or password."
            });

        }


        // ==================================
        // CREATE JWT TOKEN
        // ==================================

        const token = jwt.sign(

            {
                userId: user.id,
                username: user.username
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "24h"
            }

        );


        // ==================================
        // LOGIN SUCCESSFUL
        // ==================================

        return res.status(200).json({

            message:
                "Login successful.",

            token: token,

            user: {

                id:
                    user.id,

                username:
                    user.username

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({
            message:
                "Unable to login."
        });

    }

});


export default authRouter;