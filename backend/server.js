import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";

// basic setup
dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json())
//app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => res.status(200).json({message: "Success"}))

app.listen(port, () => console.log(`Server started on ${port}`))