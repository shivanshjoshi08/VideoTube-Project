// require('dotenv').config()
import dotenv from "dotenv"
// import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

// const app = express();
connectDB()
    .then(() => {
        const port = process.env.PORT || 8000;
        const server = app.listen(port, () => {
            console.log(`⚙️ Server is running at port : ${port}`);
        });

        server.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use. Close the other process or set a different PORT.`);
                process.exit(1);
            } else {
                console.error('Server error', err);
                process.exit(1);
            }
        });
    })
    .catch((error) => {
        console.log("MONGO DB Connection failed !!! ", error);
    })




/*
import expree from "express"
const app = express()

    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("ERROR", error);
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log(`App is listening on port ${process.env.PORT}`);
            })
        }
        catch (error) {
            console.error("ERROR", error)
            throw error
        }
    })()
*/