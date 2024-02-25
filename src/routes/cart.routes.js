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
            res.json(await cartManagerDB.getCartById(req));
        }),
    )
    .put(
        handleErrors(async (req, res) => {
            res.json(await cartManagerDB.updateCart(req));
        }),
    )
    .delete(
        handleErrors(async (req, res) => {
            res.json(await cartManagerDB.deleteCartProducts(req));
        }),
    );

cartRouter
    .route("/:cid/product/:pid")
    .post(
        handleErrors(async (req, res) => {
            res.json(await cartManagerDB.addProduct(req));
        }),
    )
    .put(
        handleErrors(async (req, res) => {
            res.json(await cartManagerDB.updateProduct(req));
        }),
    )
    .delete(
        handleErrors(async (req, res) => {
            res.json(await cartManagerDB.deleteProduct(req));
        }),
    );

export default cartRouter;
