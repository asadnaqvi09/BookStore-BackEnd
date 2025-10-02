const { default: mongoose } = require('mongoose');
const Book = require('../models/bookModel');
const WishList = require('../models/wishListModel');

const addToWishList = async (req,res)=> {
    try {
        const {bookId} = req.body;

        if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({message: "No Book Found From This ID"});

        const book = await Book.findById(bookId);

        if(!book) return res.status(404).json({message: "No Book Found"});

        let wishList = await WishList.findOne({user : req.user._id});

        if (!wishList){
            wishlist = new WishList({ user: req.user._id, items: [{ book: bookId }] });
        } else {
            const exists = wishList.items.some((i)=> i.book.toString() === bookId);
            if (exists) return res.json({message: "Already In WishList", items:wishList.items});
            wishList.items.push({book: bookId});
        }

        await wishList.save();
        const populated = await wishList.populate("items.book");
        res.json({items : populated.items});

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getWishList = async (req,res)=> {
    try {
        const wishlist = await WishList.findOne({user: req.user._id}).populate("items.book");
        
        if (!wishlist) return res.status(401).json({message: "WishList did not exists", items:[]});

        res.json({items: wishlist.items});
    } catch (error) {
        res.status(500).json({message: "Error in getWishList Controller", error: error.message});
    }
}

const removeFromWishList = async (req,res)=> {
    try {
        const {bookId} = req.params;
        if(!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).json({message: "No Book Found From This ID"});
        
        let wishList = await WishList.findOne({user: req.user._id});

        wishList.items = wishList.items.filter(i => i.book.toString() !== bookId)

        await wishList.save();
        const populated = await wishList.populate("items.book");
        res.json({ items: populated.items });
    } catch (error) {
        res.status(500).json({message: "Error in Remove From Wishlist Controller", error: error.message})
    }
}

const toggleWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid bookId" });
    }
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    let wishlist = await WishList.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new WishList({ user: req.user._id, items: [{ book: bookId }] });
      await wishlist.save();
      return res.json({ action: "added", items: wishlist.items });
    }

    const idx = wishlist.items.findIndex(i => i.book.toString() === bookId);
    if (idx > -1) {
      wishlist.items.splice(idx, 1);
      await wishlist.save();
      const populated = await wishlist.populate("items.book");
      return res.json({ action: "removed", items: populated.items });
    } else {
      wishlist.items.push({ book: bookId });
      await wishlist.save();
      const populated = await wishlist.populate("items.book");
      return res.json({ action: "added", items: populated.items });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = {addToWishList,getWishList,removeFromWishList,toggleWishlist}