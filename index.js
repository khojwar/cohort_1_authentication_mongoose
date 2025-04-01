// const express = require('express')
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './utils/db.js';    // sometime we need to add .js extension otherwise it will not work
import cookieParser from "cookie-parser";

dotenv.config();

// get all routes
import userRoutes from './routes/user.routes.js';

const app = express()
const port = process.env.PORT || 3000;

app.use(cors({
    origin: [process.env.BASE_URL, 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/tikaram', (req, res) => {
    res.send("Hello Tikaram")
})

// connect to the database
db();

app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})