import mongoose from "mongoose";
import { config } from "dotenv";

config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const url = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
    .connect(url)
    .then(() => console.log("conexion con la db exitosa"))
    .catch((error) => console.error(error));

export default mongoose;
