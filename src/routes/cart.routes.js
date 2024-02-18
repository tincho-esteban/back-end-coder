import { Router } from "express";
import path from "path";
import CartManagerFS from "../dao/fs/CartManager.js";
import CartManagerDB from "../dao/db/CartManager.db.js";

const cartRouter = Router();
const cartsFilePath = path.resolve(process.cwd(), "public", "carts.json");
const cartManagerFS = new CartManagerFS(cartsFilePath);
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
            const carts = await cartManagerDB.get();
            res.json(carts);
        }),
    )
    .post(
        handleErrors(async (req, res) => {
            const newCart = await cartManagerDB.createCart();
            res.json(newCart);
        }),
    );

cartRouter.get(
    "/:cid",
    handleErrors(async (req, res) => {
        const { cid } = req.params;
        const cart = await cartManagerDB.findCartAndProduct(cid, null);
        res.json(cart);
    }),
);

cartRouter.post(
    "/:cid/product/:pid",
    handleErrors(async (req, res) => {
        const { cid, pid } = req.params;
        const result = await cartManagerDB.addProduct(cid, pid);
        res.json(result);
    }),
);

cartRouter.get(
    "/insertion",
    handleErrors(async (req, res) => {
        let FScarts = await cartManagerFS.get();
        FScarts = FScarts.map(({ id, ...rest }) => rest);
        const carts = cartManagerDB.insertion(FScarts);
        res.json({
            message: "Carritos insertados correctamente",
            cartsInserted: carts,
        });
    }),
);

export default cartRouter;
