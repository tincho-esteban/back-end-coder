import { Schema, model } from "mongoose";

const collectionName = "carts";

const cartSchema = new Schema(
    {
        products: {
            type: [
                {
                    product: {
                        type: Schema.Types.ObjectId,
                        ref: "products",
                    },
                    quantity: { type: Number, default: 1 },
                    _id: false,
                },
            ],
            default: [],
        },
    },
    { timestamps: true },
);

cartSchema.pre("find", function () {
    this.populate("products.product");
});

cartSchema.pre("findOne", function () {
    this.populate("products.product");
});

const cartModel = model(collectionName, cartSchema);

export default cartModel;
