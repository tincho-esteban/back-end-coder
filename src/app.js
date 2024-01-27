import express from "express";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const port = 8080;
app.listen(port, () => {
    console.log("Servidor iniciado en puerto: " + port);
});
