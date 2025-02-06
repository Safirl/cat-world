import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongod from 'mongod';
import db from './config/db';
import connectDB from './config/db';
import {app} from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err: any) => {
        console.error(err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});