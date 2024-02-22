import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import productRouter from "../routes/product.routes.js";
import cartRouter from "../routes/cart.routes.js";
import viewsRouter from "../routes/views.routes.js";
import chatRouter from "../routes/chat.routes.js";
import mongoose from "./dbConfig.js";

const app = express();

app.engine("handlebars", engine());
app.set("views", path.join(process.cwd(), "src", "views"));
app.set("view engine", "handlebars");

app.use(express.json());
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

export default app;
