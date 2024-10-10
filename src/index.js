import dotenv from "dotenv";
import connectDB from './db/index.js';
import { app } from './app.js';  // Import app from app.js

dotenv.config({
    path: './env'
});

// Connect to the database and start the server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error!!!", err);
    });
