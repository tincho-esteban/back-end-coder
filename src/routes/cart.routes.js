import express from "express";
import CartManager from "../managers/CartManager.js";
import path from "path";

const cartRouter = express.Router();
const cartsFilePath = path.resolve(process.cwd(), "public", "carts.json");
const cartManager = new CartManager(cartsFilePath);

const handleErrors = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

cartRouter.get(
    "/",
    handleErrors(async (req, res) => {
        const carts = await cartManager.get();
        res.json(carts);
    }),
);

cartRouter.post(
    "/",
    handleErrors(async (req, res) => {
        const newCart = await cartManager.createCart();
        res.json(newCart);
    }),
);

cartRouter.get(
    "/:cid",
    handleErrors(async (req, res) => {
        const { cid } = req.params;
        const { cart } = await cartManager.findCartAndProduct(cid, null);
        res.json(cart);
    }),
);

cartRouter.post(
    "/:cid/product/:pid",
    handleErrors(async (req, res) => {
        const { cid, pid } = req.params;
        const result = await cartManager.addProduct(cid, pid);
        res.json(result);
    }),
);

export default cartRouter;
