import mongoose, { Mongoose } from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [false, "PLease Enter Your Product name"],
      maxLength: [200, "Product name exceed to 200 characters"],
    },
    price: {
      type: Number,
      required: [false, "Plesase Enter Your Product price"],
      maxLength: [5, "Product price exceed to 5 digits "],
    },
    description: {
      type: String,
      required: [false, "PLease Enter Your Product description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      required: [false, "Please Enter Your Product category"],
      enum: {
        values: [
          "Electronics",
          "Cameras",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Sports",
          "Outdoor",
          "Home",
        ],
        message: "Please Select correct activity",
      },
    },
    seller: {
      type: String,
      required: [false, "PLease Enter Your Product seller"],
    },
    stock: {
      type: Number,
      required: [false, "PLease Enter Your Product stock"],
    },
    numOfReview: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Product", productSchema);
