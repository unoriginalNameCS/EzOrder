import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';

// basic setup
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get('/', (req, res) => res.status(200).json({message: "Success"}))

app.use('/api/users', userRoutes);
app.use('/menus', menuRoutes);


// errors
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port}`))