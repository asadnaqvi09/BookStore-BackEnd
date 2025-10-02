const express = require('express');
const {getAllBooks,addBook,updateBookByID,deleteBookByID,getSingleBookByID,searchFilterBooks} = require('../controllers/booksController');
const {protectedRoute} = require('../middleware/authMiddleware');
const upload = require('../middleware/multerMiddleware');
const router = express.Router();

router.get('/getAllBooks', getAllBooks);
router.post('/addBook',protectedRoute, upload.array('bookImages',4) ,addBook);
router.get('/searchBooks', searchFilterBooks);
router.patch('/updateBookByID/:id',protectedRoute,upload.array('bookImages',4) ,updateBookByID);
router.delete('/deleteBookByID/:id',protectedRoute, deleteBookByID);
router.get('/getSingleBookByID/:id', getSingleBookByID);

module.exports = router;