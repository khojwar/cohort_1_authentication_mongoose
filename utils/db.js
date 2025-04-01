import mongoose from 'mongoose';

// for safty purpose, we are importing dotenv and configuring it
import dotenv from 'dotenv';
dotenv.config();


// export function that connects to the database

const db = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log("Error in connecting to database", err);
    })
}

export default db;

