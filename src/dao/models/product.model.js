import { Schema, model } from "mongoose";

const collectionName = "products";

const productSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: String, required: true },
        code: { type: String, required: true },
        stock: { type: Number, required: true },
    },
    { timestamps: true },
);

const ProductModel = model(collectionName, productSchema);

export default ProductModel;
