import mongoose from "mongoose";

const productSchema = {
  product_name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
};

export const Product = mongoose.model("product", productSchema);
