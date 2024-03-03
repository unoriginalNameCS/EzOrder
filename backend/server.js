import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// basic setup
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());
app.use(express.json())
//app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.status(200).json({message: "Success"}))

app.use('/api/users', userRoutes);


// errors
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on ${port}`))