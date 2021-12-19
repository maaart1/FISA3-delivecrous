import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {LOGIN} from "./user/login.js";
import {REGISTER} from "./user/register.js";
import {URL_NOT_EXIST_ROUTE} from "./routes/error.js";
import {POST_ROUTE} from "./routes/post.js";
import {DELETE_ROUTE} from "./routes/delete.js";
import {GET_ROUTE} from "./routes/get";

dotenv.config()

/* Application initialisation */
const app = express();
app.use(express.json());

/* DataBase Initialisation */
mongoose.connect("mongodb://localhost:27017/delivecrous");

app.use(LOGIN);
app.use(REGISTER);
app.use(GET_ROUTE)
app.use(POST_ROUTE)
app.use(DELETE_ROUTE)
app.use(URL_NOT_EXIST_ROUTE);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT} :)`)
});