import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token from cookies and authenticate the user.
 * Purpose: Protect routes by ensuring that only requests with a valid JWT can access them.
 * Input:
 *   - req.cookies.token: string (JWT token stored in cookies)
 * Output:
 *   - On success: Attaches `userId` to `req` and calls `next()` to proceed to the route handler.
 *   - On failure:
 *       - 401 Unauthorized: if no token provided or token is invalid.
 *       - 500 Server Error: if an unexpected error occurs during verification.
 */

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};