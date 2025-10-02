// seedBooks.js
require("dotenv").config(); // ⚡ .env file load karne ke liye
const mongoose = require("mongoose");
const Book = require("../models/bookModel"); // seedData folder se model import

// 📚 Books Data
const booksData = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    isbn: "9780525559474",
    price: 1899,
    rating: 4.5,
    genre: "Fiction",
    stock: 45,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190253i/52578297.jpg",
      "https://m.media-amazon.com/images/I/81cE7vCfDqL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9780525559474",
      "https://prodimage.images-bn.com/pimages/9780525559474_p0_v2_s1200x630.jpg"
    ],
    description: "A dazzling novel about all the choices that go into a life well lived. Between life and death there is a library, and within that library, the shelves go on forever.",
    publisher: "Viking Press",
    year: 2020,
    discountPrice: 1499,
    isBestSeller: true,
    isOnSale: true
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    price: 2499,
    rating: 4.8,
    genre: "Non-Fiction",
    stock: 67,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1655988385i/40121378.jpg",
      "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UF1000,1000_QL80_.jpg",
      "https://jamesclear.com/wp-content/uploads/2022/03/atomic-habits-dots.png",
      "https://prodimage.images-bn.com/pimages/9780735211292_p0_v1_s1200x630.jpg"
    ],
    description: "An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results. No matter your goals, Atomic Habits offers a proven framework.",
    publisher: "Avery Publishing",
    year: 2018,
    discountPrice: 1999,
    isBestSeller: true,
    isOnSale: true
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    isbn: "9780553380163",
    price: 1599,
    rating: 4.3,
    genre: "Science",
    stock: 32,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg",
      "https://m.media-amazon.com/images/I/71uBpa06b-L._AC_UF1000,1000_QL80_.jpg",
      "https://kbimages1-a.akamaihd.net/6c3b9d7e-8f1e-4e8e-b8e5-d8f4e9c5d3f7/1200/1200/False/a-brief-history-of-time-10.jpg",
      "https://images.penguinrandomhouse.com/cover/9780553380163"
    ],
    description: "From the Big Bang to black holes, Stephen Hawking explores the most fundamental questions about the universe in this landmark volume of scientific writing.",
    publisher: "Bantam Books",
    year: 1988,
    discountPrice: 0,
    isBestSeller: true,
    isOnSale: false
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    price: 2199,
    rating: 4.6,
    genre: "History",
    stock: 54,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg",
      "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9780062316097",
      "https://prodimage.images-bn.com/pimages/9780062316097_p0_v2_s1200x630.jpg"
    ],
    description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us.",
    publisher: "Harper Perennial",
    year: 2015,
    discountPrice: 1799,
    isBestSeller: true,
    isOnSale: true
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "9781451648539",
    price: 2799,
    rating: 4.4,
    genre: "Biography",
    stock: 28,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1511288482i/11084145.jpg",
      "https://m.media-amazon.com/images/I/81VStYnDGrL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9781451648539",
      "https://prodimage.images-bn.com/pimages/9781451648539_p0_v1_s1200x630.jpg"
    ],
    description: "Based on more than forty interviews with Steve Jobs over two years, as well as interviews with family, friends, adversaries, and colleagues, this is the biography of Jobs.",
    publisher: "Simon & Schuster",
    year: 2011,
    discountPrice: 2299,
    isBestSeller: false,
    isOnSale: true
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    price: 1299,
    rating: 4.7,
    genre: "Fiction",
    stock: 89,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg",
      "https://m.media-amazon.com/images/I/71rpa1-kyvL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9780451524935",
      "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/1410/9780141036144.jpg"
    ],
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. Written in 1949, the novel is set in Airstrip One, a province of Oceania.",
    publisher: "Signet Classic",
    year: 1949,
    discountPrice: 999,
    isBestSeller: true,
    isOnSale: true
  },
  {
    title: "Educated",
    author: "Tara Westover",
    isbn: "9780399590504",
    price: 1999,
    rating: 4.5,
    genre: "Biography",
    stock: 41,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1506026635i/35133922.jpg",
      "https://m.media-amazon.com/images/I/71-4MkLN5jL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9780399590504",
      "https://prodimage.images-bn.com/pimages/9780399590504_p0_v4_s1200x630.jpg"
    ],
    description: "A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University. An unforgettable story of resilience.",
    publisher: "Random House",
    year: 2018,
    discountPrice: 1599,
    isBestSeller: true,
    isOnSale: true
  },
  {
    title: "The Gene: An Intimate History",
    author: "Siddhartha Mukherjee",
    isbn: "9781476733524",
    price: 2399,
    rating: 4.4,
    genre: "Science",
    stock: 23,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1452452965i/27276428.jpg",
      "https://m.media-amazon.com/images/I/81bhXtUCkEL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9781476733524",
      "https://prodimage.images-bn.com/pimages/9781476733524_p0_v2_s1200x630.jpg"
    ],
    description: "From the Pulitzer Prize-winning author comes the story of the gene, illuminating its past, present, and future. A magisterial history of genetics and its implications.",
    publisher: "Scribner",
    year: 2016,
    discountPrice: 0,
    isBestSeller: false,
    isOnSale: false
  },
  {
    title: "The Guns of August",
    author: "Barbara W. Tuchman",
    isbn: "9780345476098",
    price: 1799,
    rating: 4.3,
    genre: "History",
    stock: 19,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388188048i/11366.jpg",
      "https://m.media-amazon.com/images/I/91dYGN7e4jL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9780345476098",
      "https://images-na.ssl-images-amazon.com/images/I/51YPXTP32EL._SX331_BO1,204,203,200_.jpg"
    ],
    description: "The outbreak of World War I and the first month of the conflict is covered in this Pulitzer Prize-winning history. A stunning account of the critical first weeks of WWI.",
    publisher: "Ballantine Books",
    year: 1962,
    discountPrice: 1499,
    isBestSeller: false,
    isOnSale: true
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780374533557",
    price: 2299,
    rating: 4.2,
    genre: "Non-Fiction",
    stock: 36,
    bookImg: [
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg",
      "https://m.media-amazon.com/images/I/71T04ZUWBPL._AC_UF1000,1000_QL80_.jpg",
      "https://images.penguinrandomhouse.com/cover/9780374533557",
      "https://prodimage.images-bn.com/pimages/9780374533557_p0_v3_s1200x630.jpg"
    ],
    description: "In this groundbreaking book, Nobel Prize winner Daniel Kahneman takes us on a tour of the mind and explains the two systems that drive the way we think and make decisions.",
    publisher: "Farrar, Straus and Giroux",
    year: 2011,
    discountPrice: 1899,
    isBestSeller: false,
    isOnSale: true
  }
];

// 🔌 Database Connection & Seeding Function
const seedBooks = async () => {
  try {
    // Database credentials from .env
    const DB_USERNAME = process.env.DB_USERNAME;
    const DB_PASSWORD = process.env.DB_PASSWORD;
    const db_link = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@bookcluster.xhv7aae.mongodb.net/?retryWrites=true&w=majority`;
    
    await mongoose.connect(db_link);
    console.log("✅ MongoDB Connected");

    // Pehle saari books delete kro (optional - agar fresh start chahiye)
    await Book.deleteMany({});
    console.log("🗑️  Old books deleted");

    // Books insert kro
    const result = await Book.insertMany(booksData);
    console.log(`✅ ${result.length} books successfully inserted!`);

    // Connection close kro
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding books:", error.message);
    process.exit(1);
  }
};

// Script run kro
seedBooks();