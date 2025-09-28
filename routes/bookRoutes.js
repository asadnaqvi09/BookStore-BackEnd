const express = require('express');
const {getAllBooks,addBook,updateBookByID,deleteBookByID,getSingleBookByID} = require('../controllers/booksController');
const {protectedRoute} = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');
const router = express.Router();

router.get('/getAllBooks', getAllBooks);
router.post('/addBook',protectedRoute, upload.array('bookImages',4) ,addBook);
router.patch('/updateBookByID/:id',protectedRoute, updateBookByID);
router.delete('/deleteBookByID/:id',protectedRoute, deleteBookByID);
router.get('/getSingleBookByID/:id', getSingleBookByID);

module.exports = router;