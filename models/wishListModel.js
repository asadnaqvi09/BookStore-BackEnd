const mongoose = require("mongoose");

const WishListSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true},
    items: [
        {
            book: {type: mongoose.Schema.Types.ObjectId, ref:"Book", required:true},
            quantity: {type: Number , default: 0},
        }
    ]
})

WishListSchema.index({user:1}, {unique:true});
module.exports = mongoose.model("WishList",WishListSchema);