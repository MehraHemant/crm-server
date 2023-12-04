import connectToMongoDB from "./db.js";
import express from "express";
import dotenv from 'dotenv';
import Auth from './Routes/Auth.js';
import cors from 'cors';
import Leads from "./Routes/LeadRoutes.js";
import mongoose from "mongoose";

const app = express();
dotenv.config();

app.use(cors({
    origin: true,
  }))
  
 app.use(express.json());


app.use('/', Auth);
app.use('/leads', Leads);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT))
  .then(() =>
    console.log(
      "Connected! Server is running on http://localhost:" +
        process.env.PORT +
        "/api"
    )
  )
  .catch((err) => console.log(err));
