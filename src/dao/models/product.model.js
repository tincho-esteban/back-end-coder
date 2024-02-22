import { Schema, model } from "mongoose";

const collectionName = "products";
const BASE_URL = "http://localhost:8080/static/img/";

const productSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: String },
        code: { type: String, required: true },
        stock: { type: Number, required: true },
    },
    { timestamps: true },
);

productSchema.methods.setImgUrl = function (fileName) {
    try {
        this.thumbnail = `${BASE_URL}${fileName}`;
    } catch (error) {
        console.error("Error setting image URL:", error);
    }
};
const ProductModel = model(collectionName, productSchema);

export default ProductModel;
