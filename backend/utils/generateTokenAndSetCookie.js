import jwt from "jsonwebtoken";


/**
 * Purpose: 
 *   - Generate a JWT token for a user and set it as an HTTP-only cookie in the response.
 *   - This allows secure authentication and session management for the user.
 * Input:
 *   - res: Express response object (used to set the cookie)
 *   - userId: string (unique identifier of the authenticated user)
 * Output:
 *   - Returns the generated JWT token (string)
 *   - Sets a cookie named "token" in the response with security options:
 *       - httpOnly: prevents access from JavaScript (mitigates XSS)
 *       - secure: only sent over HTTPS in production
 *       - sameSite: strict (prevents CSRF)
 *       - maxAge: 7 days
 */

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie("token", token, {
		httpOnly: true, // XSS attack prevention 
		secure: process.env.NODE_ENV === "production", // https during productiom
		sameSite: "strict",  // to prevent csrf attack 
		maxAge: 7 * 24 * 60 * 60 * 1000,  // token expires in 7 days 
	});

	return token;
};