import { Schema, model } from "mongoose";

const collectionName = "messages";

const messagesSchema = new Schema(
    {
        user: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true },
);

const messageModel = model(collectionName, messagesSchema);

export default messageModel;
