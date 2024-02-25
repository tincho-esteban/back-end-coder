import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collectionName = "products";
const BASE_URL = "http://localhost:8080/static/img/";

const productSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        thumbnail: { type: Array, default: [] },
        code: { type: String, required: true },
        stock: { type: Number, required: true },
    },
    { timestamps: true },
);

productSchema.plugin(mongoosePaginate);

productSchema.methods.setImgUrl = function (fileNames) {
    try {
        this.thumbnail = fileNames.map((fileName) => `${BASE_URL}${fileName}`);
    } catch (error) {
        console.error("Error setting image URLs:", error);
    }
};
const ProductModel = model(collectionName, productSchema);

export default ProductModel;
