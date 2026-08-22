import jwt from "jsonwebtoken";


// ==========================================
// VERIFY LOGIN TOKEN
// ==========================================

export function authenticateUser(req, res, next) {

    // Get Authorization header
    const authHeader = req.headers.authorization;


    // Token missing
    if (!authHeader || !authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "Access denied. Please login."
        });
    }


    // Extract token
    const token = authHeader.split(" ")[1];


    try {

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Store logged-in user's ID
        req.user = {
            id: decoded.userId,
            username: decoded.username
        };


        next();


    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired login. Please login again."
        });

    }
}