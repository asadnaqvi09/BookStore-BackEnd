const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    genre: {
      type: String,
      required: true,
      enum: ["Fiction", "Non-Fiction", "Science", "History", "Biography"],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    bookImg: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
      default: "",
      max: 200,
      min: 10,
    },
    publisher: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
BookSchema.index({title: 'text',author: 'text',isbn: 1});
module.exports = mongoose.model("Book", BookSchema);