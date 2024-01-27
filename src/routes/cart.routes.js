import express from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../ProductManager.js";
import path from "path";

const cartRouter = express.Router();
const cartsFilePath = path.resolve(process.cwd(), "public", "carts.json");
const cartManager = new CartManager(cartsFilePath);
const productsFilePath = path.resolve(process.cwd(), "public", "products.json");
const productManager = new ProductManager(productsFilePath);

const findCartAndProduct = async (cid, pid) => {
    const carts = await cartManager.get();
    const cart = carts.find((cart) => cart.id == cid);
    if (!cart) {
        throw new Error("Carrito no encontrado");
    }
    const products = await productManager.get();
    const product = products.find((product) => product.id == pid);
    if (!product) {
        throw new Error("Producto no encontrado");
    }
    return { cart, product, carts };
};
cartRouter.get("/", async (req, res) => {
    try {
        const carts = await cartManager.get();
        res.json(carts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

cartRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

cartRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const { cart } = await findCartAndProduct(cid, null);
        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const { cart, product, carts } = await findCartAndProduct(cid, pid);

        if (!product) {
            res.status(404).json({ error: "Producto no encontrado" });
            return;
        }

        const productInCart = cart.products.find(
            (product) => product.id === pid,
        );
        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.products.push({ id: pid, quantity: 1 });
        }
        await cartManager.write(carts);
        res.json({ message: "Producto agregado al carrito" });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

export default cartRouter;
