const express = require('express');
const {addToCart,removeFromCart,getCart,updateCart,clearCart,increaseQuantity,decreaseQuantity} = require('../controllers/cartController')
const router = express.Router();

router.get('/',getCart);
router.post('/add',addToCart);
router.patch('/update',updateCart);
router.delete("/remove/:bookId", removeFromCart);
router.delete("/clear", clearCart);
router.put("/increase/:productId", increaseQuantity);
router.put("/decrease/:productId", decreaseQuantity);

module.exports = router;