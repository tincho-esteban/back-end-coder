import ProductManager from "./ProductManager.js";
import express from "express";
import path from "path";

const app = express();
const port = 8080;

const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManager = new ProductManager(productsFilePath);

app.get("/products", async (req, res, next) => {
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit;
        const limitedProducts = limit ? products.slice(0, limit) : products;
        res.send(limitedProducts);
    } catch (err) {
        next(err);
    }
});

app.get("/products/:pid", async (req, res) => {
    const products = await productManager.getProducts();
    const product = products.find(
        (product) => product.id === Number(req.params.pid),
    );
    if (product) {
        res.send(product);
    } else {
        res.status(404).send({ error: "Producto no encontrado" });
    }
});

app.listen(port, () => {
    console.log("Servidor iniciado en puerto: " + port);
});
