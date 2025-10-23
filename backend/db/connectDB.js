import mongoose from "mongoose";

// Purpose: Establish a connection to the MongoDB database using Mongoose.
// Input: None directly, but uses environment variable `process.env.MONGO_URI` for the connection string.
// Output:
//   - On success: Logs the connected host to the console.
//   - On failure: Logs the error message and exits the process with status code 1.

export const connectDB = async () => {
	try {
		// console.log("mongo_uri: ", process.env.MONGO_URI);
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connection to MongoDB: ", error.message);
		process.exit(1); // 1 is failure, 0 status code is success
	}
};