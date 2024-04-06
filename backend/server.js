import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import requestRoutes from './routes/requestRoutes.js'
import restaurantRoutes from './routes/restaurantRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';

// basic setup
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(function (req, res, next) {
    next()
})

app.get('/', (req, res) => res.status(200).json({message: "Success"}))

app.use('/api/users', userRoutes);
app.use('/menus', menuRoutes);
app.use('/tables', tableRoutes);
app.use('/orders', orderRoutes);
app.use('/requests', requestRoutes);
app.use('/restaurants', restaurantRoutes)

// errors
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port}`))