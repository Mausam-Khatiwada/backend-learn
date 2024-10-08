import express from "express";
import dotenv from "dotenv"
import connectDB from './db/index.js';

dotenv.config({
    path:'./env'
})

const app = express();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on the port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Mongodb connection error!!!",err)
})









