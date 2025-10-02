const Cart = require("../models/cartModel");
const Book = require("../models/bookModel");

// ✅ Add to Cart
const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    const findBook = await Book.findById(bookId);
    if (!findBook) {
      return res.status(400).json({ message: "Sorry, book not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Check if book already in cart
      const itemIndex = cart.items.findIndex(
        (item) => item.book.toString() === bookId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ book: bookId, quantity, price: findBook.price });
      }
    } else {
      // New cart
      cart = new Cart({
        user: req.user._id,
        items: [{ book: bookId, quantity, price: findBook.price }],
      });
    }

    // Total Price Calculate
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Book added to cart", cart });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

// ✅ Get Cart
const getCart = async (req, res) => {
  try {
    const findCart = await Cart.findOne({ user: req.user._id }).populate(
      "items.book"
    );

    if (!findCart) return res.json({ items: [], totalPrice: 0 });

    res.json(findCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Fetching Cart", error: error.message });
  }
};

// ✅ Update Cart
const updateCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart Not Found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.book.toString() === bookId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Book Not In Cart" });
    }

    if (quantity > 0) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    res.json({ message: "Cart Updated", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in Update Cart", error: error.message });
  }
};

// ✅ Remove Single Item
const removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res.status(404).json({ message: "Cart not found for this user" });

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Item Removed From Cart", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in Remove Cart", error: error.message });
  }
};

// ✅ Clear Cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.json({ message: "Cart cleared", cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

// PUT /api/cart/increase/:productId
const increaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity += 1;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// PUT /api/cart/decrease/:productId
const decreaseQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // remove if 0
      cart.items = cart.items.filter(
        (i) => i.product.toString() !== productId
      );
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity
};