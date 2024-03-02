import { Router } from "express";
import CartManagerDB from "../dao/db/CartManager.db.js";

const cartRouter = Router();

const cartManagerDB = new CartManagerDB();

const handleErrors = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

cartRouter
    .route("/")
    .get(
        handleErrors(async (req, res) => {
            res.json(await cartManagerDB.get());
        }),
    )
    .post(
        handleErrors(async (req, res) => {
            res.json(await cartManagerDB.createCart());
        }),
    );

cartRouter.get(
    "/insertion",
    handleErrors(async (req, res) => {
        res.json(await cartManagerDB.insertion());
    }),
);

cartRouter
    .route("/:cid")
    .get(
        handleErrors(async (req, res) => {
            const { cid } = req.params;

            res.json(await cartManagerDB.getCartById(cid));
        }),
    )
    .put(
        handleErrors(async (req, res) => {
            const { cid } = req.params;
            const { products } = req.body;
            res.json(await cartManagerDB.updateCart(cid, products));
        }),
    )
    .delete(
        handleErrors(async (req, res) => {
            const { cid } = req.params;
            res.json(await cartManagerDB.deleteCartProducts(cid));
        }),
    );

cartRouter
    .route("/:cid/product/:pid")
    .post(
        handleErrors(async (req, res) => {
            const { cid, pid } = req.params;
            res.json(await cartManagerDB.addProduct(cid, pid));
        }),
    )
    .put(
        handleErrors(async (req, res) => {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            res.json(await cartManagerDB.updateProduct(cid, pid, quantity));
        }),
    )
    .delete(
        handleErrors(async (req, res) => {
            const { cid, pid } = req.params;
            res.json(await cartManagerDB.deleteProduct(cid, pid));
        }),
    );

export default cartRouter;
