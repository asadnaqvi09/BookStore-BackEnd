const express = require('express');
const {getWishList,addToWishList,removeFromWishList,toggleWishlist} = require('../controllers/wishListController');
const router = express.Router();

router.get('/', getWishList);
router.post('/add', addToWishList);
router.delete('/remove/:bookId', removeFromWishList);
router.post('/toggleWishList', toggleWishlist);

module.exports = router;