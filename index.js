const express = require('express');
const dotEnv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const app = express();
const PORT = process.env.PORT || 4000;
const connectWithDb = require('./config/db.config');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


app.use(cors({
  origin: "http://localhost:5173", // ya 3000 agar CRA hai
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.json());
dotEnv.config();
connectWithDb();

app.use('/api/user', authRoutes)
app.use('/api/book', bookRoutes)

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})