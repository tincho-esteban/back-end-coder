import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import path from "path";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import __dirname from "./utils.js";

const port = 8080;
const app = express();

const httpServer = app.listen(port, () => {
    console.log(`Servidor iniciado en puerto: ${port}`);
});
const io = new Server(httpServer);

app.engine("handlebars", engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/", viewsRouter);

app.use(express.json());
app.use(express.static("public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.use((req, res, next) => {
    res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("newProduct", (data) => {
        io.emit("newProduct", data);
    });

    socket.on("deleteProduct", (data) => {
        io.emit("productToDelete", data);
    });
});
