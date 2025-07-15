import express from "express"; 
import {connectDB} from './db/connectDB.js';
import dotenv from "dotenv";  
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js'; 
import interviewRoutes from './routes/interview.routes.js';
import geminiRoutes from './routes/gemini.routes.js';
import cors from "cors";



dotenv.config(); 

const app = express();  
app.use(express.json()); 
app.use(cookieParser()); // allows us to parse incoming cookies 

const PORT = process.env.PORT || 3000; 

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost on any port
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true 
}));
 
app.use("/auth/api", authRoutes); 
app.use('/api/interviews', interviewRoutes);
app.use('/api/mockinterview', geminiRoutes);


app.listen(PORT, ()=>{ 
    connectDB();
    console.log(`Listen at port ${PORT}`)
});