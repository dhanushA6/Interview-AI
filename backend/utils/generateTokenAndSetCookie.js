import jwt from "jsonwebtoken";



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