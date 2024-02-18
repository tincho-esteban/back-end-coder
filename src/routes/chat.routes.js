import express from "express";
import messageModel from "../dao/models/message.model.js";

const chatRouter = express.Router();

const handleErrors = (cb) => async (req, res, next) => {
    try {
        await cb(req, res, next);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
};

chatRouter.get("/", (req, res) => {
    res.render("chat", {});
});

chatRouter.get(
    "/message",
    handleErrors(async (req, res) => {
        const messages = await messageModel.find();
        res.status(200).json(messages);
    }),
);

export default chatRouter;
