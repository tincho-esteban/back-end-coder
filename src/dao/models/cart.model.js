import { Schema, model } from "mongoose";

const collectionName = "carts";

const cartSchema = new Schema(
    {
        products: { type: [String], required: true },
    },
    { timestamps: true },
);

const cartModel = model(collectionName, cartSchema);

export default cartModel;
