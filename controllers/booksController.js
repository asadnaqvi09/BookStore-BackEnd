const Book = require("../models/bookModel");
const cloudinary = require("../utilis/cloudinary");

const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;

    const books = await Book.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("bookImg author price title");

    const countPagination = await Book.countDocuments();

    res.json({
      books,
      totalPage: Math.ceil(countPagination / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GetAllBooks Error:", error.message); // roman urdu: error log krna
    res.status(500).json({ message: "Internal server error" });
  }
};

const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      price,
      rating,
      genre,
      stock,
      bookImg,
      description,
      publisher,
      year,
      discountPrice,
      isBestSeller,
      isOnSale,
    } = req.body;
    
    if (
      !title ||
      !author ||
      !isbn ||
      !price ||
      !rating ||
      !genre ||
      !stock ||
      !description ||
      !publisher ||
      !year ||
      typeof isBestSeller === "undefined" ||
      typeof isOnSale === "undefined"
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let book = await Book.findOne({ title, isbn });
    if (book) {
      return res.status(400).json({ message: "Book already exists" });
    }

    if (isOnSale && discountPrice >= price) {
      return res
        .status(400)
        .json({ message: "Discount price must be less than price" });
    }

    let bookImages = [];
    if (req.files && req.files.length > 0) {
      bookImages = req.files.map((file) => file.path);
    }
    let bookUrls = [];
    if (bookImg) {
      bookUrls = Array.isArray(bookImg) ? bookImg : [bookImg];
    }
    let bookImage = [...new Set([...bookImages, ...bookUrls])];
    if (bookImage.length === 0) {
      return res
        .status(400)
        .json({ message: "Atleast one book image is required" });
    }
    if (bookImage.length > 4) {
      return res
        .status(400)
        .json({ message: "Atmost 4 book images are allowed" });
    }
    const newBook = new Book({
      title,
      author,
      isbn,
      price,
      rating,
      genre,
      stock,
      description,
      publisher,
      year,
      discountPrice,
      isBestSeller,
      isOnSale,
      bookImg: bookImage,
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("AddBook Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBookByID = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      isbn,
      price,
      rating,
      genre,
      stock,
      bookImg,
      description,
      publisher,
      year,
      discountPrice,
      isBestSeller,
      isOnSale,
      imageOperations,
      removeImage,
    } = req.body;

    let book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    let bookImages = [];
    if (req.files && req.files.length > 0) {
      bookImages = req.files.map((file) => file.path);
    }
    let bookUrls = [];
    if (bookImg) {
      bookUrls = Array.isArray(bookImg) ? bookImg : [bookImg];
    }
    let newBookImage = [...new Set([...bookImages, ...bookUrls])];

    if (imageOperations === "replace") {
      book.bookImg = newBookImage;
    } else if (imageOperations === "append") {
      book.bookImg = [...new Set([...book.bookImg, ...newBookImage])];
    } else if (imageOperations === "remove" && Array.isArray(removeImage)) {
      book.bookImg = book.bookImg.filter((img) => !removeImage.includes(img));
      for (let img of removeImage) {
        try {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Cloudinary delete error:", error.message);
        }
      }
    }

    if (book.bookImg.length === 0) {
      return res
        .status(400)
        .json({ message: "Atleast one book image is required" });
    }
    if (book.bookImg.length > 4) {
      return res
        .status(400)
        .json({ message: "Atmost 4 book images are allowed" });
    }
    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (price) book.price = price;
    if (rating) book.rating = rating;
    if (genre) book.genre = genre;
    if (stock) book.stock = stock;
    if (description) book.description = description;
    if (publisher) book.publisher = publisher;
    if (year) book.year = year;
    if (discountPrice !== undefined) book.discountPrice = discountPrice;
    if (typeof isBestSeller !== "undefined") book.isBestSeller = isBestSeller;
    if (typeof isOnSale !== "undefined") book.isOnSale = isOnSale;

    if (book.isOnSale && book.discountPrice >= book.price) {
      return res
        .status(400)
        .json({ message: "Discount price must be less than price" });
    }

    // roman urdu: save kro
    await book.save();
    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    console.error("UpdateBook Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteBookByID = async(req,res)=> {
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(401).json({ message: "Book not found" });
    }
    if (book.bookImg && book.bookImg.length > 0){
      for (let img of book.bookImg){
        try {
          const publicId = img.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (error) {
          console.error("Cloudinary delete error:", error.message);
        }
      }
    }
    await Book.findByIdAndDelete(id);
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("DeleteBook Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSingleBookByID = async (req,res)=>{
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(401).json({message: "Book Not Found"});
    }
    res.json({ message: "Book fetched successfully", book });
  } catch (error) {
    console.error("Error in fetching Book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

const searchFilterBooks = async (req, res) => {
  try {
    const {
      query,
      genre,
      minPrice,
      maxPrice,
      sortBy,
      isBestSeller,
      isOnSale,
      page = 1,
      limit = 8,
    } = req.query;

    let filter = {};

    // 🔍 Title / Author / ISBN search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ];
    }

    // 📂 Genre (array of strings)
    if (genre && genre !== "All Categories") {
      filter.genre = { $in: [new RegExp(genre, "i")] };
    }

    // 💰 Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 🏆 BestSeller / OnSale flags
    if (isBestSeller === "true") filter.isBestSeller = true;
    if (isOnSale === "true") filter.isOnSale = true;

    // 📊 Sorting
    let sort = {};
    if (sortBy === "priceLowToHigh") sort.price = 1;
    else if (sortBy === "priceHighToLow") sort.price = -1;
    else if (sortBy === "latest") sort.createdAt = -1; // assuming createdAt hai model mein

    // 📑 Pagination
    const skip = (page - 1) * limit;
    const totalBooks = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      message: "Books fetched successfully",
      books,
      totalBooks,
      currentPage: Number(page),
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error("Error in fetching Books:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { getAllBooks, addBook, updateBookByID, deleteBookByID, getSingleBookByID, searchFilterBooks };